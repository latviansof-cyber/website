#!/usr/bin/env bash

# ==============================================================================
# Quick Build & Deploy Script for Latvians of Darwin (Payload 3 + Cloudflare)
# ==============================================================================

set -eo pipefail

# Ensure we are in the project root directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Color definitions
COLOR_RESET="\033[0m"
COLOR_BOLD="\033[1m"
COLOR_INFO="\033[36m"    # Cyan
COLOR_STEP="\033[34m"    # Blue
COLOR_SUCCESS="\033[32m" # Green
COLOR_WARN="\033[33m"    # Yellow
COLOR_ERROR="\033[31m"   # Red

log_info()    { echo -e "${COLOR_INFO}[INFO]${COLOR_RESET} $*"; }
log_step()    { echo -e "\n${COLOR_STEP}${COLOR_BOLD}===> $*${COLOR_RESET}"; }
log_success() { echo -e "${COLOR_SUCCESS}${COLOR_BOLD}[SUCCESS]${COLOR_RESET} $*"; }
log_warn()    { echo -e "${COLOR_WARN}[WARN]${COLOR_RESET} $*"; }
log_error()   { echo -e "${COLOR_ERROR}${COLOR_BOLD}[ERROR]${COLOR_RESET} $*" >&2; }

trap 'log_error "Deployment failed! Check log messages above."' ERR

# Default options
MODE="full"       # full | app-only | db-only | build-only
SKIP_TYPES=false
YES_CONFIRM=false
VERIFY=false
ENV_NAME=""

show_help() {
  cat << EOF
${COLOR_BOLD}Latvians of Darwin - Build & Deploy Script${COLOR_RESET}

Usage: ./deploy.sh [options]

Modes:
  -a, --app-only      Deploy application Worker only (skips database migrations)
  -d, --db-only       Deploy D1 database migrations only
  -f, --full          Deploy both database migrations and application Worker (default)
  -b, --build-only    Build Next.js + OpenNext Cloudflare locally (no deployment)

Options:
  -e, --env <env>     Specify Cloudflare environment (sets CLOUDFLARE_ENV)
  -y, --yes           Skip confirmation prompts (non-interactive)
      --skip-types    Skip TypeScript generation step (generate:types)
      --verify        Run post-deployment REST API health check
  -h, --help          Show this help message

Examples:
  ./deploy.sh --app-only            Quick deploy for frontend changes
  ./deploy.sh --full                Full production deployment (DB + App)
  ./deploy.sh --build-only          Test build locally before pushing
  ./deploy.sh --app-only -y         Deploy app without interactive confirmation
EOF
}

# Parse CLI flags
while [[ $# -gt 0 ]]; do
  case "$1" in
    -a|--app-only)
      MODE="app-only"
      shift
      ;;
    -d|--db-only)
      MODE="db-only"
      shift
      ;;
    -f|--full)
      MODE="full"
      shift
      ;;
    -b|--build-only)
      MODE="build-only"
      shift
      ;;
    -e|--env)
      if [[ -n "$2" && "$2" != -* ]]; then
        ENV_NAME="$2"
        shift 2
      else
        log_error "Option --env requires a value."
        exit 1
      fi
      ;;
    --env=*)
      ENV_NAME="${1#*=}"
      shift
      ;;
    -y|--yes)
      YES_CONFIRM=true
      shift
      ;;
    --skip-types)
      SKIP_TYPES=true
      shift
      ;;
    --verify)
      VERIFY=true
      shift
      ;;
    -h|--help)
      show_help
      exit 0
      ;;
    *)
      log_error "Unknown flag: $1"
      show_help
      exit 1
      ;;
  esac
done

# Pre-flight checks
log_step "Running pre-flight checks"

if ! command -v pnpm &> /dev/null; then
  log_error "pnpm is not installed or not in PATH."
  exit 1
fi

# Check git status
if command -v git &> /dev/null && git rev-parse --is-inside-work-tree &> /dev/null; then
  CURRENT_BRANCH=$(git branch --show-current || echo "unknown")
  log_info "Current git branch: ${COLOR_BOLD}${CURRENT_BRANCH}${COLOR_RESET}"
  if [[ -n "$(git status --porcelain)" ]]; then
    log_warn "Working directory has uncommitted changes:"
    git status --short
  fi
fi

# Export CLOUDFLARE_ENV if specified
if [[ -n "$ENV_NAME" ]]; then
  export CLOUDFLARE_ENV="$ENV_NAME"
  log_info "Cloudflare Environment set to: ${COLOR_BOLD}${CLOUDFLARE_ENV}${COLOR_RESET}"
fi

# Confirm deployment if interactive and not build-only
if [[ "$YES_CONFIRM" = false && "$MODE" != "build-only" ]]; then
  echo -e "\n${COLOR_BOLD}Deployment Summary:${COLOR_RESET}"
  echo "  Mode:        $MODE"
  echo "  Environment: ${CLOUDFLARE_ENV:-default}"
  echo "  Skip Types:  $SKIP_TYPES"
  echo ""
  read -p "Proceed with deployment? [y/N] " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    log_warn "Deployment cancelled by user."
    exit 0
  fi
fi

START_TIME=$SECONDS

# Step: Generate Types
if [[ "$SKIP_TYPES" = false ]]; then
  log_step "Generating TypeScript definitions"
  pnpm run generate:types
else
  log_info "Skipping TypeScript definition generation (--skip-types)"
fi

# Execution based on mode
case "$MODE" in
  build-only)
    log_step "Building Next.js & OpenNext Cloudflare bundle (Build-Only)"
    pnpm run build:next
    node scripts/clean-vercel-og.mjs
    pnpm exec opennextjs-cloudflare build --skipNextBuild ${CLOUDFLARE_ENV:+--env=$CLOUDFLARE_ENV}
    log_success "Build completed successfully!"
    ;;

  app-only)
    log_step "Deploying Application Worker (App-Only)"
    pnpm run deploy:app
    log_success "Application deployed successfully!"
    ;;

  db-only)
    log_step "Deploying Database Migrations (DB-Only)"
    pnpm run deploy:database
    log_success "Database migrations deployed successfully!"
    ;;

  full)
    log_step "Deploying Database Migrations and Application Worker (Full Deploy)"
    pnpm run deploy
    log_success "Full deployment completed successfully!"
    ;;
esac

# Optional Post-Deployment Verification
if [[ "$VERIFY" = true && "$MODE" != "build-only" ]]; then
  log_step "Running post-deployment REST API health check"
  DOMAIN="latviansofdarwin.org.au"
  log_info "Pinging site settings endpoint (https://${DOMAIN}/api/globals/site-settings)..."
  if curl -fsS --connect-timeout 10 "https://${DOMAIN}/api/globals/site-settings" > /dev/null; then
    log_success "Health check passed: REST API endpoint returned 200 OK"
  else
    log_warn "Health check ping failed or timed out. Please manually verify site status."
  fi
fi

ELAPSED=$(( SECONDS - START_TIME ))
MINUTES=$(( ELAPSED / 60 ))
SECS=$(( ELAPSED % 60 ))

log_step "Deployment complete!"
if [[ $MINUTES -gt 0 ]]; then
  log_info "Total time elapsed: ${MINUTES}m ${SECS}s"
else
  log_info "Total time elapsed: ${SECS}s"
fi
