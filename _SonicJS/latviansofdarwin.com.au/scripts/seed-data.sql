INSERT INTO document_types (id, name, display_name, description, schema, source, is_active)
VALUES ('pages', 'pages', 'Pages', 'Bilingual Pages', '{}', 'code', 1)
ON CONFLICT(id) DO UPDATE SET display_name = excluded.display_name, is_active = 1;
INSERT INTO document_types (id, name, display_name, description, schema, source, is_active)
VALUES ('events', 'events', 'Events', 'Community Events', '{}', 'code', 1)
ON CONFLICT(id) DO UPDATE SET display_name = excluded.display_name, is_active = 1;
INSERT INTO document_types (id, name, display_name, description, schema, source, is_active)
VALUES ('navigation', 'navigation', 'Navigation', 'Header Menu', '{}', 'code', 1)
ON CONFLICT(id) DO UPDATE SET display_name = excluded.display_name, is_active = 1;
INSERT INTO document_types (id, name, display_name, description, schema, source, is_active)
VALUES ('footer', 'footer', 'Footer', 'Site Footer', '{}', 'code', 1)
ON CONFLICT(id) DO UPDATE SET display_name = excluded.display_name, is_active = 1;
INSERT INTO document_types (id, name, display_name, description, schema, source, is_active)
VALUES ('site_settings', 'site_settings', 'Site Settings', 'Global Site Settings', '{}', 'code', 1)
ON CONFLICT(id) DO UPDATE SET display_name = excluded.display_name, is_active = 1;

INSERT INTO documents (
  id, root_id, type_id, type_version, version_of_id, version_number,
  is_current_draft, is_published, status, parent_root_id, slug, path, title, zone,
  sort_order, visible, published_at, scheduled_at, expires_at, deleted_at,
  tenant_id, locale, translation_group_id, data, metadata,
  owner_id, created_by, updated_by, created_at, updated_at
) VALUES (
  'uploads/40c99b4d978d3e3c1f4c8.ico', 'uploads/40c99b4d978d3e3c1f4c8.ico', 'media_asset', 1, NULL, 1,
  1, 1, 'published', '', NULL, NULL, '40c99b4d978d3e3c1f4c8.ico', NULL,
  0, 1, 1788447667, NULL, NULL, NULL, 'default', 'default', '', '{"filename":"40c99b4d978d3e3c1f4c8.ico","originalName":"40c99b4d978d3e3c1f4c8.ico","mimeType":"image/x-icon","size":15086,"width":null,"height":null,"folder":"uploads","r2Key":"uploads/40c99b4d978d3e3c1f4c8.ico","alt":"","caption":"","tags":[]}', '{}',
  NULL, NULL, NULL, 1788447667, 1788447667
) ON CONFLICT(id) DO UPDATE SET
  title = excluded.title, data = excluded.data, is_published = 1,
  is_current_draft = 1, status = 'published', updated_at = excluded.updated_at;

INSERT INTO documents (
  id, root_id, type_id, type_version, version_of_id, version_number,
  is_current_draft, is_published, status, parent_root_id, slug, path, title, zone,
  sort_order, visible, published_at, scheduled_at, expires_at, deleted_at,
  tenant_id, locale, translation_group_id, data, metadata,
  owner_id, created_by, updated_by, created_at, updated_at
) VALUES (
  'uploads/e9cd9febfcf6d193954bc.png', 'uploads/e9cd9febfcf6d193954bc.png', 'media_asset', 1, NULL, 1,
  1, 1, 'published', '', NULL, NULL, 'e9cd9febfcf6d193954bc.png', NULL,
  0, 1, 1788447667, NULL, NULL, NULL, 'default', 'default', '', '{"filename":"e9cd9febfcf6d193954bc.png","originalName":"e9cd9febfcf6d193954bc.png","mimeType":"image/png","size":14968,"width":null,"height":null,"folder":"uploads","r2Key":"uploads/e9cd9febfcf6d193954bc.png","alt":"","caption":"","tags":[]}', '{}',
  NULL, NULL, NULL, 1788447667, 1788447667
) ON CONFLICT(id) DO UPDATE SET
  title = excluded.title, data = excluded.data, is_published = 1,
  is_current_draft = 1, status = 'published', updated_at = excluded.updated_at;

INSERT INTO documents (
  id, root_id, type_id, type_version, version_of_id, version_number,
  is_current_draft, is_published, status, parent_root_id, slug, path, title, zone,
  sort_order, visible, published_at, scheduled_at, expires_at, deleted_at,
  tenant_id, locale, translation_group_id, data, metadata,
  owner_id, created_by, updated_by, created_at, updated_at
) VALUES (
  'uploads/87a286d39839779b38c5d.webp', 'uploads/87a286d39839779b38c5d.webp', 'media_asset', 1, NULL, 1,
  1, 1, 'published', '', NULL, NULL, '87a286d39839779b38c5d.webp', NULL,
  0, 1, 1788447667, NULL, NULL, NULL, 'default', 'default', '', '{"filename":"87a286d39839779b38c5d.webp","originalName":"87a286d39839779b38c5d.webp","mimeType":"image/webp","size":116614,"width":null,"height":null,"folder":"uploads","r2Key":"uploads/87a286d39839779b38c5d.webp","alt":"","caption":"","tags":[]}', '{}',
  NULL, NULL, NULL, 1788447667, 1788447667
) ON CONFLICT(id) DO UPDATE SET
  title = excluded.title, data = excluded.data, is_published = 1,
  is_current_draft = 1, status = 'published', updated_at = excluded.updated_at;

INSERT INTO documents (
  id, root_id, type_id, type_version, version_of_id, version_number,
  is_current_draft, is_published, status, parent_root_id, slug, path, title, zone,
  sort_order, visible, published_at, scheduled_at, expires_at, deleted_at,
  tenant_id, locale, translation_group_id, data, metadata,
  owner_id, created_by, updated_by, created_at, updated_at
) VALUES (
  'uploads/aea385281c85795070b5c.webp', 'uploads/aea385281c85795070b5c.webp', 'media_asset', 1, NULL, 1,
  1, 1, 'published', '', NULL, NULL, 'aea385281c85795070b5c.webp', NULL,
  0, 1, 1788447667, NULL, NULL, NULL, 'default', 'default', '', '{"filename":"aea385281c85795070b5c.webp","originalName":"aea385281c85795070b5c.webp","mimeType":"image/webp","size":346264,"width":null,"height":null,"folder":"uploads","r2Key":"uploads/aea385281c85795070b5c.webp","alt":"","caption":"","tags":[]}', '{}',
  NULL, NULL, NULL, 1788447667, 1788447667
) ON CONFLICT(id) DO UPDATE SET
  title = excluded.title, data = excluded.data, is_published = 1,
  is_current_draft = 1, status = 'published', updated_at = excluded.updated_at;

INSERT INTO documents (
  id, root_id, type_id, type_version, version_of_id, version_number,
  is_current_draft, is_published, status, parent_root_id, slug, path, title, zone,
  sort_order, visible, published_at, scheduled_at, expires_at, deleted_at,
  tenant_id, locale, translation_group_id, data, metadata,
  owner_id, created_by, updated_by, created_at, updated_at
) VALUES (
  'uploads/a5a44622e65aeba4696c3.webp', 'uploads/a5a44622e65aeba4696c3.webp', 'media_asset', 1, NULL, 1,
  1, 1, 'published', '', NULL, NULL, 'a5a44622e65aeba4696c3.webp', NULL,
  0, 1, 1788447667, NULL, NULL, NULL, 'default', 'default', '', '{"filename":"a5a44622e65aeba4696c3.webp","originalName":"a5a44622e65aeba4696c3.webp","mimeType":"image/webp","size":399266,"width":null,"height":null,"folder":"uploads","r2Key":"uploads/a5a44622e65aeba4696c3.webp","alt":"","caption":"","tags":[]}', '{}',
  NULL, NULL, NULL, 1788447667, 1788447667
) ON CONFLICT(id) DO UPDATE SET
  title = excluded.title, data = excluded.data, is_published = 1,
  is_current_draft = 1, status = 'published', updated_at = excluded.updated_at;

INSERT INTO documents (
  id, root_id, type_id, type_version, version_of_id, version_number,
  is_current_draft, is_published, status, parent_root_id, slug, path, title, zone,
  sort_order, visible, published_at, scheduled_at, expires_at, deleted_at,
  tenant_id, locale, translation_group_id, data, metadata,
  owner_id, created_by, updated_by, created_at, updated_at
) VALUES (
  'uploads/56ec8f7f54b2fe125c9b5.webp', 'uploads/56ec8f7f54b2fe125c9b5.webp', 'media_asset', 1, NULL, 1,
  1, 1, 'published', '', NULL, NULL, '56ec8f7f54b2fe125c9b5.webp', NULL,
  0, 1, 1788447667, NULL, NULL, NULL, 'default', 'default', '', '{"filename":"56ec8f7f54b2fe125c9b5.webp","originalName":"56ec8f7f54b2fe125c9b5.webp","mimeType":"image/webp","size":411634,"width":null,"height":null,"folder":"uploads","r2Key":"uploads/56ec8f7f54b2fe125c9b5.webp","alt":"","caption":"","tags":[]}', '{}',
  NULL, NULL, NULL, 1788447667, 1788447667
) ON CONFLICT(id) DO UPDATE SET
  title = excluded.title, data = excluded.data, is_published = 1,
  is_current_draft = 1, status = 'published', updated_at = excluded.updated_at;

INSERT INTO documents (
  id, root_id, type_id, type_version, version_of_id, version_number,
  is_current_draft, is_published, status, parent_root_id, slug, path, title, zone,
  sort_order, visible, published_at, scheduled_at, expires_at, deleted_at,
  tenant_id, locale, translation_group_id, data, metadata,
  owner_id, created_by, updated_by, created_at, updated_at
) VALUES (
  'uploads/1457990af5846f1fa6f38.jpg', 'uploads/1457990af5846f1fa6f38.jpg', 'media_asset', 1, NULL, 1,
  1, 1, 'published', '', NULL, NULL, '1457990af5846f1fa6f38.jpg', NULL,
  0, 1, 1788447667, NULL, NULL, NULL, 'default', 'default', '', '{"filename":"1457990af5846f1fa6f38.jpg","originalName":"1457990af5846f1fa6f38.jpg","mimeType":"image/jpeg","size":85364,"width":null,"height":null,"folder":"uploads","r2Key":"uploads/1457990af5846f1fa6f38.jpg","alt":"","caption":"","tags":[]}', '{}',
  NULL, NULL, NULL, 1788447667, 1788447667
) ON CONFLICT(id) DO UPDATE SET
  title = excluded.title, data = excluded.data, is_published = 1,
  is_current_draft = 1, status = 'published', updated_at = excluded.updated_at;

INSERT INTO documents (
  id, root_id, type_id, type_version, version_of_id, version_number,
  is_current_draft, is_published, status, parent_root_id, slug, path, title, zone,
  sort_order, visible, published_at, scheduled_at, expires_at, deleted_at,
  tenant_id, locale, translation_group_id, data, metadata,
  owner_id, created_by, updated_by, created_at, updated_at
) VALUES (
  'uploads/9cb8354371d97d91120d1.jpg', 'uploads/9cb8354371d97d91120d1.jpg', 'media_asset', 1, NULL, 1,
  1, 1, 'published', '', NULL, NULL, '9cb8354371d97d91120d1.jpg', NULL,
  0, 1, 1788447667, NULL, NULL, NULL, 'default', 'default', '', '{"filename":"9cb8354371d97d91120d1.jpg","originalName":"9cb8354371d97d91120d1.jpg","mimeType":"image/jpeg","size":66274,"width":null,"height":null,"folder":"uploads","r2Key":"uploads/9cb8354371d97d91120d1.jpg","alt":"","caption":"","tags":[]}', '{}',
  NULL, NULL, NULL, 1788447667, 1788447667
) ON CONFLICT(id) DO UPDATE SET
  title = excluded.title, data = excluded.data, is_published = 1,
  is_current_draft = 1, status = 'published', updated_at = excluded.updated_at;

INSERT INTO documents (
  id, root_id, type_id, type_version, version_of_id, version_number,
  is_current_draft, is_published, status, parent_root_id, slug, path, title, zone,
  sort_order, visible, published_at, scheduled_at, expires_at, deleted_at,
  tenant_id, locale, translation_group_id, data, metadata,
  owner_id, created_by, updated_by, created_at, updated_at
) VALUES (
  'uploads/58a0b3d51187c368496cf.png', 'uploads/58a0b3d51187c368496cf.png', 'media_asset', 1, NULL, 1,
  1, 1, 'published', '', NULL, NULL, '58a0b3d51187c368496cf.png', NULL,
  0, 1, 1788447667, NULL, NULL, NULL, 'default', 'default', '', '{"filename":"58a0b3d51187c368496cf.png","originalName":"58a0b3d51187c368496cf.png","mimeType":"image/png","size":516367,"width":null,"height":null,"folder":"uploads","r2Key":"uploads/58a0b3d51187c368496cf.png","alt":"","caption":"","tags":[]}', '{}',
  NULL, NULL, NULL, 1788447667, 1788447667
) ON CONFLICT(id) DO UPDATE SET
  title = excluded.title, data = excluded.data, is_published = 1,
  is_current_draft = 1, status = 'published', updated_at = excluded.updated_at;

INSERT INTO documents (
  id, root_id, type_id, type_version, version_of_id, version_number,
  is_current_draft, is_published, status, parent_root_id, slug, path, title, zone,
  sort_order, visible, published_at, scheduled_at, expires_at, deleted_at,
  tenant_id, locale, translation_group_id, data, metadata,
  owner_id, created_by, updated_by, created_at, updated_at
) VALUES (
  'uploads/5668d0323fc1700c67a2e.png', 'uploads/5668d0323fc1700c67a2e.png', 'media_asset', 1, NULL, 1,
  1, 1, 'published', '', NULL, NULL, '5668d0323fc1700c67a2e.png', NULL,
  0, 1, 1788447667, NULL, NULL, NULL, 'default', 'default', '', '{"filename":"5668d0323fc1700c67a2e.png","originalName":"5668d0323fc1700c67a2e.png","mimeType":"image/png","size":526136,"width":null,"height":null,"folder":"uploads","r2Key":"uploads/5668d0323fc1700c67a2e.png","alt":"","caption":"","tags":[]}', '{}',
  NULL, NULL, NULL, 1788447667, 1788447667
) ON CONFLICT(id) DO UPDATE SET
  title = excluded.title, data = excluded.data, is_published = 1,
  is_current_draft = 1, status = 'published', updated_at = excluded.updated_at;

INSERT INTO documents (
  id, root_id, type_id, type_version, version_of_id, version_number,
  is_current_draft, is_published, status, parent_root_id, slug, path, title, zone,
  sort_order, visible, published_at, scheduled_at, expires_at, deleted_at,
  tenant_id, locale, translation_group_id, data, metadata,
  owner_id, created_by, updated_by, created_at, updated_at
) VALUES (
  'uploads/d697e634cb1ae4946d88b.png', 'uploads/d697e634cb1ae4946d88b.png', 'media_asset', 1, NULL, 1,
  1, 1, 'published', '', NULL, NULL, 'd697e634cb1ae4946d88b.png', NULL,
  0, 1, 1788447667, NULL, NULL, NULL, 'default', 'default', '', '{"filename":"d697e634cb1ae4946d88b.png","originalName":"d697e634cb1ae4946d88b.png","mimeType":"image/png","size":507950,"width":null,"height":null,"folder":"uploads","r2Key":"uploads/d697e634cb1ae4946d88b.png","alt":"","caption":"","tags":[]}', '{}',
  NULL, NULL, NULL, 1788447667, 1788447667
) ON CONFLICT(id) DO UPDATE SET
  title = excluded.title, data = excluded.data, is_published = 1,
  is_current_draft = 1, status = 'published', updated_at = excluded.updated_at;

INSERT INTO documents (
  id, root_id, type_id, type_version, version_of_id, version_number,
  is_current_draft, is_published, status, parent_root_id, slug, path, title, zone,
  sort_order, visible, published_at, scheduled_at, expires_at, deleted_at,
  tenant_id, locale, translation_group_id, data, metadata,
  owner_id, created_by, updated_by, created_at, updated_at
) VALUES (
  'uploads/3b09fa70a9e1a257df835.webp', 'uploads/3b09fa70a9e1a257df835.webp', 'media_asset', 1, NULL, 1,
  1, 1, 'published', '', NULL, NULL, '3b09fa70a9e1a257df835.webp', NULL,
  0, 1, 1788447667, NULL, NULL, NULL, 'default', 'default', '', '{"filename":"3b09fa70a9e1a257df835.webp","originalName":"3b09fa70a9e1a257df835.webp","mimeType":"image/webp","size":128922,"width":null,"height":null,"folder":"uploads","r2Key":"uploads/3b09fa70a9e1a257df835.webp","alt":"","caption":"","tags":[]}', '{}',
  NULL, NULL, NULL, 1788447667, 1788447667
) ON CONFLICT(id) DO UPDATE SET
  title = excluded.title, data = excluded.data, is_published = 1,
  is_current_draft = 1, status = 'published', updated_at = excluded.updated_at;

INSERT INTO documents (
  id, root_id, type_id, type_version, version_of_id, version_number,
  is_current_draft, is_published, status, parent_root_id, slug, path, title, zone,
  sort_order, visible, published_at, scheduled_at, expires_at, deleted_at,
  tenant_id, locale, translation_group_id, data, metadata,
  owner_id, created_by, updated_by, created_at, updated_at
) VALUES (
  'uploads/a94688d8024e0702cde65.webp', 'uploads/a94688d8024e0702cde65.webp', 'media_asset', 1, NULL, 1,
  1, 1, 'published', '', NULL, NULL, 'a94688d8024e0702cde65.webp', NULL,
  0, 1, 1788447667, NULL, NULL, NULL, 'default', 'default', '', '{"filename":"a94688d8024e0702cde65.webp","originalName":"a94688d8024e0702cde65.webp","mimeType":"image/webp","size":3732,"width":null,"height":null,"folder":"uploads","r2Key":"uploads/a94688d8024e0702cde65.webp","alt":"","caption":"","tags":[]}', '{}',
  NULL, NULL, NULL, 1788447667, 1788447667
) ON CONFLICT(id) DO UPDATE SET
  title = excluded.title, data = excluded.data, is_published = 1,
  is_current_draft = 1, status = 'published', updated_at = excluded.updated_at;

INSERT INTO documents (
  id, root_id, type_id, type_version, version_of_id, version_number,
  is_current_draft, is_published, status, parent_root_id, slug, path, title, zone,
  sort_order, visible, published_at, scheduled_at, expires_at, deleted_at,
  tenant_id, locale, translation_group_id, data, metadata,
  owner_id, created_by, updated_by, created_at, updated_at
) VALUES (
  'uploads/ec2b805a29776b6a28b14.webp', 'uploads/ec2b805a29776b6a28b14.webp', 'media_asset', 1, NULL, 1,
  1, 1, 'published', '', NULL, NULL, 'ec2b805a29776b6a28b14.webp', NULL,
  0, 1, 1788447667, NULL, NULL, NULL, 'default', 'default', '', '{"filename":"ec2b805a29776b6a28b14.webp","originalName":"ec2b805a29776b6a28b14.webp","mimeType":"image/webp","size":1864,"width":null,"height":null,"folder":"uploads","r2Key":"uploads/ec2b805a29776b6a28b14.webp","alt":"","caption":"","tags":[]}', '{}',
  NULL, NULL, NULL, 1788447667, 1788447667
) ON CONFLICT(id) DO UPDATE SET
  title = excluded.title, data = excluded.data, is_published = 1,
  is_current_draft = 1, status = 'published', updated_at = excluded.updated_at;

INSERT INTO documents (
  id, root_id, type_id, type_version, version_of_id, version_number,
  is_current_draft, is_published, status, parent_root_id, slug, path, title, zone,
  sort_order, visible, published_at, scheduled_at, expires_at, deleted_at,
  tenant_id, locale, translation_group_id, data, metadata,
  owner_id, created_by, updated_by, created_at, updated_at
) VALUES (
  'uploads/46760b71e54516e7ac3de.webp', 'uploads/46760b71e54516e7ac3de.webp', 'media_asset', 1, NULL, 1,
  1, 1, 'published', '', NULL, NULL, '46760b71e54516e7ac3de.webp', NULL,
  0, 1, 1788447667, NULL, NULL, NULL, 'default', 'default', '', '{"filename":"46760b71e54516e7ac3de.webp","originalName":"46760b71e54516e7ac3de.webp","mimeType":"image/webp","size":3422,"width":null,"height":null,"folder":"uploads","r2Key":"uploads/46760b71e54516e7ac3de.webp","alt":"","caption":"","tags":[]}', '{}',
  NULL, NULL, NULL, 1788447667, 1788447667
) ON CONFLICT(id) DO UPDATE SET
  title = excluded.title, data = excluded.data, is_published = 1,
  is_current_draft = 1, status = 'published', updated_at = excluded.updated_at;

INSERT INTO documents (
  id, root_id, type_id, type_version, version_of_id, version_number,
  is_current_draft, is_published, status, parent_root_id, slug, path, title, zone,
  sort_order, visible, published_at, scheduled_at, expires_at, deleted_at,
  tenant_id, locale, translation_group_id, data, metadata,
  owner_id, created_by, updated_by, created_at, updated_at
) VALUES (
  'uploads/00c83279589382d6763d8.webp', 'uploads/00c83279589382d6763d8.webp', 'media_asset', 1, NULL, 1,
  1, 1, 'published', '', NULL, NULL, '00c83279589382d6763d8.webp', NULL,
  0, 1, 1788447667, NULL, NULL, NULL, 'default', 'default', '', '{"filename":"00c83279589382d6763d8.webp","originalName":"00c83279589382d6763d8.webp","mimeType":"image/webp","size":2762,"width":null,"height":null,"folder":"uploads","r2Key":"uploads/00c83279589382d6763d8.webp","alt":"","caption":"","tags":[]}', '{}',
  NULL, NULL, NULL, 1788447667, 1788447667
) ON CONFLICT(id) DO UPDATE SET
  title = excluded.title, data = excluded.data, is_published = 1,
  is_current_draft = 1, status = 'published', updated_at = excluded.updated_at;

INSERT INTO documents (
  id, root_id, type_id, type_version, version_of_id, version_number,
  is_current_draft, is_published, status, parent_root_id, slug, path, title, zone,
  sort_order, visible, published_at, scheduled_at, expires_at, deleted_at,
  tenant_id, locale, translation_group_id, data, metadata,
  owner_id, created_by, updated_by, created_at, updated_at
) VALUES (
  'uploads/1534469e01ce9dccd6dc1.svg', 'uploads/1534469e01ce9dccd6dc1.svg', 'media_asset', 1, NULL, 1,
  1, 1, 'published', '', NULL, NULL, '1534469e01ce9dccd6dc1.svg', NULL,
  0, 1, 1788447667, NULL, NULL, NULL, 'default', 'default', '', '{"filename":"1534469e01ce9dccd6dc1.svg","originalName":"1534469e01ce9dccd6dc1.svg","mimeType":"image/svg+xml","size":45498,"width":null,"height":null,"folder":"uploads","r2Key":"uploads/1534469e01ce9dccd6dc1.svg","alt":"","caption":"","tags":[]}', '{}',
  NULL, NULL, NULL, 1788447667, 1788447667
) ON CONFLICT(id) DO UPDATE SET
  title = excluded.title, data = excluded.data, is_published = 1,
  is_current_draft = 1, status = 'published', updated_at = excluded.updated_at;

INSERT INTO documents (
  id, root_id, type_id, type_version, version_of_id, version_number,
  is_current_draft, is_published, status, parent_root_id, slug, path, title, zone,
  sort_order, visible, published_at, scheduled_at, expires_at, deleted_at,
  tenant_id, locale, translation_group_id, data, metadata,
  owner_id, created_by, updated_by, created_at, updated_at
) VALUES (
  'uploads/bc1a5a4415aac279fc59e.jpg', 'uploads/bc1a5a4415aac279fc59e.jpg', 'media_asset', 1, NULL, 1,
  1, 1, 'published', '', NULL, NULL, 'bc1a5a4415aac279fc59e.jpg', NULL,
  0, 1, 1788447667, NULL, NULL, NULL, 'default', 'default', '', '{"filename":"bc1a5a4415aac279fc59e.jpg","originalName":"bc1a5a4415aac279fc59e.jpg","mimeType":"image/jpeg","size":252757,"width":null,"height":null,"folder":"uploads","r2Key":"uploads/bc1a5a4415aac279fc59e.jpg","alt":"","caption":"","tags":[]}', '{}',
  NULL, NULL, NULL, 1788447667, 1788447667
) ON CONFLICT(id) DO UPDATE SET
  title = excluded.title, data = excluded.data, is_published = 1,
  is_current_draft = 1, status = 'published', updated_at = excluded.updated_at;

INSERT INTO documents (
  id, root_id, type_id, type_version, version_of_id, version_number,
  is_current_draft, is_published, status, parent_root_id, slug, path, title, zone,
  sort_order, visible, published_at, scheduled_at, expires_at, deleted_at,
  tenant_id, locale, translation_group_id, data, metadata,
  owner_id, created_by, updated_by, created_at, updated_at
) VALUES (
  'uploads/ce354bffcb941b34dc671.jpeg', 'uploads/ce354bffcb941b34dc671.jpeg', 'media_asset', 1, NULL, 1,
  1, 1, 'published', '', NULL, NULL, 'ce354bffcb941b34dc671.jpeg', NULL,
  0, 1, 1788447667, NULL, NULL, NULL, 'default', 'default', '', '{"filename":"ce354bffcb941b34dc671.jpeg","originalName":"ce354bffcb941b34dc671.jpeg","mimeType":"image/jpeg","size":3667327,"width":null,"height":null,"folder":"uploads","r2Key":"uploads/ce354bffcb941b34dc671.jpeg","alt":"","caption":"","tags":[]}', '{}',
  NULL, NULL, NULL, 1788447667, 1788447667
) ON CONFLICT(id) DO UPDATE SET
  title = excluded.title, data = excluded.data, is_published = 1,
  is_current_draft = 1, status = 'published', updated_at = excluded.updated_at;

INSERT INTO documents (
  id, root_id, type_id, type_version, version_of_id, version_number,
  is_current_draft, is_published, status, parent_root_id, slug, path, title, zone,
  sort_order, visible, published_at, scheduled_at, expires_at, deleted_at,
  tenant_id, locale, translation_group_id, data, metadata,
  owner_id, created_by, updated_by, created_at, updated_at
) VALUES (
  'uploads/72a4aa0393bb0dc06c2eb.jpg', 'uploads/72a4aa0393bb0dc06c2eb.jpg', 'media_asset', 1, NULL, 1,
  1, 1, 'published', '', NULL, NULL, '72a4aa0393bb0dc06c2eb.jpg', NULL,
  0, 1, 1788447667, NULL, NULL, NULL, 'default', 'default', '', '{"filename":"72a4aa0393bb0dc06c2eb.jpg","originalName":"72a4aa0393bb0dc06c2eb.jpg","mimeType":"image/webp","size":58534,"width":null,"height":null,"folder":"uploads","r2Key":"uploads/72a4aa0393bb0dc06c2eb.jpg","alt":"","caption":"","tags":[]}', '{}',
  NULL, NULL, NULL, 1788447667, 1788447667
) ON CONFLICT(id) DO UPDATE SET
  title = excluded.title, data = excluded.data, is_published = 1,
  is_current_draft = 1, status = 'published', updated_at = excluded.updated_at;

INSERT INTO documents (
  id, root_id, type_id, type_version, version_of_id, version_number,
  is_current_draft, is_published, status, parent_root_id, slug, path, title, zone,
  sort_order, visible, published_at, scheduled_at, expires_at, deleted_at,
  tenant_id, locale, translation_group_id, data, metadata,
  owner_id, created_by, updated_by, created_at, updated_at
) VALUES (
  'uploads/c783e78bc74af3cfc7549.webp', 'uploads/c783e78bc74af3cfc7549.webp', 'media_asset', 1, NULL, 1,
  1, 1, 'published', '', NULL, NULL, 'c783e78bc74af3cfc7549.webp', NULL,
  0, 1, 1788447667, NULL, NULL, NULL, 'default', 'default', '', '{"filename":"c783e78bc74af3cfc7549.webp","originalName":"c783e78bc74af3cfc7549.webp","mimeType":"image/webp","size":232050,"width":null,"height":null,"folder":"uploads","r2Key":"uploads/c783e78bc74af3cfc7549.webp","alt":"","caption":"","tags":[]}', '{}',
  NULL, NULL, NULL, 1788447667, 1788447667
) ON CONFLICT(id) DO UPDATE SET
  title = excluded.title, data = excluded.data, is_published = 1,
  is_current_draft = 1, status = 'published', updated_at = excluded.updated_at;

INSERT INTO documents (
  id, root_id, type_id, type_version, version_of_id, version_number,
  is_current_draft, is_published, status, parent_root_id, slug, path, title, zone,
  sort_order, visible, published_at, scheduled_at, expires_at, deleted_at,
  tenant_id, locale, translation_group_id, data, metadata,
  owner_id, created_by, updated_by, created_at, updated_at
) VALUES (
  'uploads/32ad35a30fbb6bcd94bfb.jpg', 'uploads/32ad35a30fbb6bcd94bfb.jpg', 'media_asset', 1, NULL, 1,
  1, 1, 'published', '', NULL, NULL, '32ad35a30fbb6bcd94bfb.jpg', NULL,
  0, 1, 1788447667, NULL, NULL, NULL, 'default', 'default', '', '{"filename":"32ad35a30fbb6bcd94bfb.jpg","originalName":"32ad35a30fbb6bcd94bfb.jpg","mimeType":"image/jpeg","size":3112960,"width":null,"height":null,"folder":"uploads","r2Key":"uploads/32ad35a30fbb6bcd94bfb.jpg","alt":"","caption":"","tags":[]}', '{}',
  NULL, NULL, NULL, 1788447667, 1788447667
) ON CONFLICT(id) DO UPDATE SET
  title = excluded.title, data = excluded.data, is_published = 1,
  is_current_draft = 1, status = 'published', updated_at = excluded.updated_at;

INSERT INTO documents (
  id, root_id, type_id, type_version, version_of_id, version_number,
  is_current_draft, is_published, status, parent_root_id, slug, path, title, zone,
  sort_order, visible, published_at, scheduled_at, expires_at, deleted_at,
  tenant_id, locale, translation_group_id, data, metadata,
  owner_id, created_by, updated_by, created_at, updated_at
) VALUES (
  'uploads/03ffd000d13a76e9839b6.webp', 'uploads/03ffd000d13a76e9839b6.webp', 'media_asset', 1, NULL, 1,
  1, 1, 'published', '', NULL, NULL, '03ffd000d13a76e9839b6.webp', NULL,
  0, 1, 1788447667, NULL, NULL, NULL, 'default', 'default', '', '{"filename":"03ffd000d13a76e9839b6.webp","originalName":"03ffd000d13a76e9839b6.webp","mimeType":"image/webp","size":132286,"width":null,"height":null,"folder":"uploads","r2Key":"uploads/03ffd000d13a76e9839b6.webp","alt":"Jani-ugunskurs","caption":"","tags":[]}', '{}',
  NULL, NULL, NULL, 1788447667, 1788447667
) ON CONFLICT(id) DO UPDATE SET
  title = excluded.title, data = excluded.data, is_published = 1,
  is_current_draft = 1, status = 'published', updated_at = excluded.updated_at;

INSERT INTO documents (
  id, root_id, type_id, type_version, version_of_id, version_number,
  is_current_draft, is_published, status, parent_root_id, slug, path, title, zone,
  sort_order, visible, published_at, scheduled_at, expires_at, deleted_at,
  tenant_id, locale, translation_group_id, data, metadata,
  owner_id, created_by, updated_by, created_at, updated_at
) VALUES (
  'uploads/e8ad88045f84514e76360.webp', 'uploads/e8ad88045f84514e76360.webp', 'media_asset', 1, NULL, 1,
  1, 1, 'published', '', NULL, NULL, 'e8ad88045f84514e76360.webp', NULL,
  0, 1, 1788447667, NULL, NULL, NULL, 'default', 'default', '', '{"filename":"e8ad88045f84514e76360.webp","originalName":"e8ad88045f84514e76360.webp","mimeType":"image/webp","size":366168,"width":null,"height":null,"folder":"uploads","r2Key":"uploads/e8ad88045f84514e76360.webp","alt":"Lieldienas 1","caption":"","tags":[]}', '{}',
  NULL, NULL, NULL, 1788447667, 1788447667
) ON CONFLICT(id) DO UPDATE SET
  title = excluded.title, data = excluded.data, is_published = 1,
  is_current_draft = 1, status = 'published', updated_at = excluded.updated_at;

INSERT INTO documents (
  id, root_id, type_id, type_version, version_of_id, version_number,
  is_current_draft, is_published, status, parent_root_id, slug, path, title, zone,
  sort_order, visible, published_at, scheduled_at, expires_at, deleted_at,
  tenant_id, locale, translation_group_id, data, metadata,
  owner_id, created_by, updated_by, created_at, updated_at
) VALUES (
  'uploads/578246ccd4e099fd5240d.webp', 'uploads/578246ccd4e099fd5240d.webp', 'media_asset', 1, NULL, 1,
  1, 1, 'published', '', NULL, NULL, '578246ccd4e099fd5240d.webp', NULL,
  0, 1, 1788447667, NULL, NULL, NULL, 'default', 'default', '', '{"filename":"578246ccd4e099fd5240d.webp","originalName":"578246ccd4e099fd5240d.webp","mimeType":"image/webp","size":444268,"width":null,"height":null,"folder":"uploads","r2Key":"uploads/578246ccd4e099fd5240d.webp","alt":"4 Maijs 2026 at Nightcliff","caption":"","tags":[]}', '{}',
  NULL, NULL, NULL, 1788447667, 1788447667
) ON CONFLICT(id) DO UPDATE SET
  title = excluded.title, data = excluded.data, is_published = 1,
  is_current_draft = 1, status = 'published', updated_at = excluded.updated_at;

INSERT INTO documents (
  id, root_id, type_id, type_version, version_of_id, version_number,
  is_current_draft, is_published, status, parent_root_id, slug, path, title, zone,
  sort_order, visible, published_at, scheduled_at, expires_at, deleted_at,
  tenant_id, locale, translation_group_id, data, metadata,
  owner_id, created_by, updated_by, created_at, updated_at
) VALUES (
  'uploads/bb490ad46004a170b7d0c.webp', 'uploads/bb490ad46004a170b7d0c.webp', 'media_asset', 1, NULL, 1,
  1, 1, 'published', '', NULL, NULL, 'bb490ad46004a170b7d0c.webp', NULL,
  0, 1, 1788447667, NULL, NULL, NULL, 'default', 'default', '', '{"filename":"bb490ad46004a170b7d0c.webp","originalName":"bb490ad46004a170b7d0c.webp","mimeType":"image/webp","size":177042,"width":null,"height":null,"folder":"uploads","r2Key":"uploads/bb490ad46004a170b7d0c.webp","alt":"Jani ugunskurs","caption":"","tags":[]}', '{}',
  NULL, NULL, NULL, 1788447667, 1788447667
) ON CONFLICT(id) DO UPDATE SET
  title = excluded.title, data = excluded.data, is_published = 1,
  is_current_draft = 1, status = 'published', updated_at = excluded.updated_at;

INSERT INTO documents (
  id, root_id, type_id, type_version, version_of_id, version_number,
  is_current_draft, is_published, status, parent_root_id, slug, path, title, zone,
  sort_order, visible, published_at, scheduled_at, expires_at, deleted_at,
  tenant_id, locale, translation_group_id, data, metadata,
  owner_id, created_by, updated_by, created_at, updated_at
) VALUES (
  'uploads/6065e8897f0ccaa67543e.webp', 'uploads/6065e8897f0ccaa67543e.webp', 'media_asset', 1, NULL, 1,
  1, 1, 'published', '', NULL, NULL, '6065e8897f0ccaa67543e.webp', NULL,
  0, 1, 1788447667, NULL, NULL, NULL, 'default', 'default', '', '{"filename":"6065e8897f0ccaa67543e.webp","originalName":"6065e8897f0ccaa67543e.webp","mimeType":"image/webp","size":229942,"width":null,"height":null,"folder":"uploads","r2Key":"uploads/6065e8897f0ccaa67543e.webp","alt":"Baltic Way 2025","caption":"","tags":[]}', '{}',
  NULL, NULL, NULL, 1788447667, 1788447667
) ON CONFLICT(id) DO UPDATE SET
  title = excluded.title, data = excluded.data, is_published = 1,
  is_current_draft = 1, status = 'published', updated_at = excluded.updated_at;

INSERT INTO documents (
  id, root_id, type_id, type_version, version_of_id, version_number,
  is_current_draft, is_published, status, parent_root_id, slug, path, title, zone,
  sort_order, visible, published_at, scheduled_at, expires_at, deleted_at,
  tenant_id, locale, translation_group_id, data, metadata,
  owner_id, created_by, updated_by, created_at, updated_at
) VALUES (
  'uploads/a0bcb2c63cfd55f38ae94.webp', 'uploads/a0bcb2c63cfd55f38ae94.webp', 'media_asset', 1, NULL, 1,
  1, 1, 'published', '', NULL, NULL, 'a0bcb2c63cfd55f38ae94.webp', NULL,
  0, 1, 1788447667, NULL, NULL, NULL, 'default', 'default', '', '{"filename":"a0bcb2c63cfd55f38ae94.webp","originalName":"a0bcb2c63cfd55f38ae94.webp","mimeType":"image/webp","size":294014,"width":null,"height":null,"folder":"uploads","r2Key":"uploads/a0bcb2c63cfd55f38ae94.webp","alt":"18 novembris","caption":"","tags":[]}', '{}',
  NULL, NULL, NULL, 1788447667, 1788447667
) ON CONFLICT(id) DO UPDATE SET
  title = excluded.title, data = excluded.data, is_published = 1,
  is_current_draft = 1, status = 'published', updated_at = excluded.updated_at;

DELETE FROM documents WHERE type_id = 'pages' AND slug IS NOT NULL AND slug = 'elections-2026' AND is_current_draft = 1 AND id <> 'page-elections-2026';
INSERT INTO documents (
  id, root_id, type_id, type_version, version_of_id, version_number,
  is_current_draft, is_published, status, parent_root_id, slug, path, title, zone,
  sort_order, visible, published_at, scheduled_at, expires_at, deleted_at,
  tenant_id, locale, translation_group_id, data, metadata,
  owner_id, created_by, updated_by, created_at, updated_at
) VALUES (
  'page-elections-2026', 'page-elections-2026', 'pages', 1, NULL, 1,
  1, 1, 'published', '', 'elections-2026', NULL, 'Voting abroad in the Latvian elections', NULL,
  10, 1, 1788447667, NULL, NULL, NULL,
  'default', 'default', '', '{"slug":"elections-2026","template":"content","sortOrder":10,"title_en":"Voting abroad in the Latvian elections","title_lv":"Atrodies ārvalstīs un vēlies balsot pa pastu?","excerpt_en":"Voters overseas during the Latvian elections who have a valid passport can vote in the 15th Saeima elections by post.","excerpt_lv":"Vēlētāji, kuri vēlēšanu laikā uzturas ārvalstīs, 15. Saeimas vēlēšanās var balsot pa pastu. Ārpus Latvijas nodotās balsis pieskaita Rīgas vēlēšanu apgabalam.","body_en":"<p><span style=\"background-color: rgb(250, 250, 250); color: rgb(87, 94, 107);\">Voters overseas during the Latvian elections who have a valid passport can vote in the 15th Saeima elections by post. Votes cast outside Latvia are counted in the Rīga electoral district.</span></p><p><br></p><p>&lt;iframe width=\"560\" height=\"315\" src=\"https://www.youtube.com/embed/IGufUlcM6BU?si=haF6YwtIR5Byr8SB\" title=\"YouTube video player\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" allowfullscreen&gt;&lt;/iframe&gt;</p><p><br></p>","body_lv":"<p>Vēlētāji, kuri vēlēšanu laikā uzturas ārvalstīs, 15. Saeimas vēlēšanās var balsot pa pastu. Ārpus Latvijas nodotās balsis pieskaita Rīgas vēlēšanu apgabalam.</p><p><br></p><p>&lt;iframe width=\"560\" height=\"315\" src=\"https://www.youtube.com/embed/IGufUlcM6BU?si=haF6YwtIR5Byr8SB\" title=\"YouTube video player\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" allowfullscreen&gt;&lt;/iframe&gt;</p>","heroImage":"/files/uploads/bc1a5a4415aac279fc59e.jpg","ctaLabel_en":"","ctaLabel_lv":"","ctaHref":"","metaTitle_en":"Atrodies ārvalstīs un vēlies balsot pa pastu?","metaTitle_lv":"Atrodies ārvalstīs un vēlies balsot pa pastu?","metaDescription_en":"Voters overseas during the Latvian elections who have a valid passport can vote in the 15th Saeima elections by post.","metaDescription_lv":"Voters overseas during the Latvian elections who have a valid passport can vote in the 15th Saeima elections by post.","noIndex":false}', '{}',
  NULL, NULL, NULL, 1788447667, 1788447667
) ON CONFLICT(id) DO UPDATE SET
  type_id = excluded.type_id,
  slug = excluded.slug,
  title = excluded.title,
  sort_order = excluded.sort_order,
  data = excluded.data,
  is_published = 1,
  is_current_draft = 1,
  status = 'published',
  published_at = excluded.published_at,
  updated_at = unixepoch();

DELETE FROM documents WHERE type_id = 'pages' AND slug IS NOT NULL AND slug = 'pitch-black-2026' AND is_current_draft = 1 AND id <> 'page-pitch-black-2026';
INSERT INTO documents (
  id, root_id, type_id, type_version, version_of_id, version_number,
  is_current_draft, is_published, status, parent_root_id, slug, path, title, zone,
  sort_order, visible, published_at, scheduled_at, expires_at, deleted_at,
  tenant_id, locale, translation_group_id, data, metadata,
  owner_id, created_by, updated_by, created_at, updated_at
) VALUES (
  'page-pitch-black-2026', 'page-pitch-black-2026', 'pages', 1, NULL, 1,
  1, 1, 'published', '', 'pitch-black-2026', NULL, 'Exercise Pitch Black 2026 – When the World’s Air Forces Came to Darwin', NULL,
  10, 1, 1788447667, NULL, NULL, NULL,
  'default', 'default', '', '{"slug":"pitch-black-2026","template":"content","sortOrder":10,"title_en":"Exercise Pitch Black 2026 – When the World’s Air Forces Came to Darwin","title_lv":"Exercise Pitch Black 2026 – kad Dārvinā ieradās pasaules gaisa spēki","excerpt_en":"From spectacular flying displays over Mindil Beach to getting up close to fighter jets, members of the Latvian Association of Darwin experienced Exercise Pitch Black 2026","excerpt_lv":"No iespaidīgās lidojumu parādes virs Mindilas pludmales (Mindil Beach) līdz iespējai klātienē apskatīt iznīcinātājus – Dārvinas Latviešu Apvienības (DLA) biedri piedzīvoja Exercise Pitch Black 2026","body_en":"<p>From spectacular flying displays over Mindil Beach to getting up close to fighter jets, members of the Latvian Association of Darwin experienced Exercise Pitch Black 2026</p><p><br></p><p>Every two years, Darwin becomes the centre of international military aviation as the Royal Australian Air Force (RAAF) welcomes air forces from around the world for Exercise Pitch Black.</p><p>For three weeks, from 20 July to 7 August 2026, the skies over Darwin and the Northern Territory reverberated with the distinctive roar of fighter jets taking off, conducting training missions and returning to RAAF Base Darwin.</p><p>For the people of Darwin, however, Pitch Black is not only about military training. It is also an opportunity for the community to see and experience the international exercise first-hand.</p><p>The spectacular Mindil Beach Flying Display on 23 July and the free RAAF Darwin Open Day on 1 August were, in many respects, a thank you to the people of Darwin for putting up with the noise and disruption caused by the hundreds of military aircraft operating from the city during the exercise.</p><p>Members of the Latvian Association of Darwin were among those who took the opportunity to enjoy both events.</p><p>The roar of Pitch Black</p><p>For Darwin residents, the arrival of Pitch Black means that the sound of fighter jets becomes part of everyday life.</p><p>For Reinis Dancis, President of the Latvian Association of Darwin, the experience is particularly familiar.</p><p>Reinis regularly appears at NT WorkSafe in Berrimah Business Park, located just beyond the end of the RAAF Darwin runway. During Exercise Pitch Black, the location provides an excellent – although sometimes rather loud – reminder that major international military exercises are taking place just overhead.</p><p>While making submissions at NT WorkSafe, Reinis has on numerous occasions had to pause proceedings as the thunder of fighter jets taking off passes directly overhead.</p><p>For several weeks, this became a familiar experience for businesses and residents across the northern suburbs of Darwin.</p><p>The community''s patience with the increased aircraft activity is one reason the public events surrounding Pitch Black are so important. They provide the people of Darwin with an opportunity to share in the excitement of the exercise rather than simply hearing it overhead.</p><p>A spectacular evening at Mindil Beach</p><p>On Thursday, 23 July, thousands of people gathered at Mindil Beach for the Pitch Black Flying Display.</p><p>Members of the Latvian Association of Darwin joined the crowd to watch Australian and international military aircraft perform spectacular passes over the beach and Darwin Harbour.</p><p>Against the backdrop of a Top End sunset, fighter jets and other aircraft thundered across the sky, providing an unforgettable display of military aviation.</p><p>For the Latvian community, it was also an opportunity to come together and enjoy one of Darwin''s major annual events.</p><p>The flying display demonstrated the international character of Pitch Black, with aircraft from Australia and partner nations participating in the exercise.</p><p>Getting up close on 1 August</p><p>If the Mindil Beach display provided the opportunity to watch the aircraft from below, the RAAF Darwin Open Day on Saturday, 1 August allowed visitors to get much closer.</p><p>The gates of RAAF Base Darwin were opened to the public, providing a rare opportunity to walk among military aircraft, meet pilots and air force personnel, and learn more about the people behind the aircraft that had been filling Darwin''s skies with noise for the previous two weeks.</p><p>Members of the Latvian Association of Darwin took full advantage of the opportunity to get up close to the aircraft.</p><p>Standing beside the jets provided a very different perspective from seeing them streak across the sky. Visitors could appreciate the enormous size and technical complexity of the aircraft, while speaking with Australian and international military personnel about the exercise and their roles.</p><p>The scale of the event was remarkable. Around 25,500 people attended the Open Day, with aircraft and personnel from 21 nations represented.</p><p>For Darwin, this was a remarkable demonstration of the city''s role as Australia''s northern gateway to the Indo-Pacific.</p><p>The world comes to Darwin</p><p>Exercise Pitch Black 2026 involved more than 100 aircraft and up to 2,500 military personnel operating from RAAF Bases Darwin and Tindal in the Northern Territory and RAAF Base Amberley in Queensland.</p><p>The participating nations included Australia, Brunei, Canada, Fiji, Finland, France, Germany, India, Indonesia, Japan, Malaysia, New Zealand, Papua New Guinea, the Philippines, the Republic of Korea, Singapore, Spain, Sweden, Thailand, the United Kingdom and the United States.</p><p>Pitch Black has been conducted in the Northern Territory since 1983 and has developed into one of the RAAF''s most important international air exercises. It provides participating nations with an opportunity to train together in complex air operations while developing interoperability, professional relationships and mutual understanding.</p><p>For Darwin, however, the exercise also provides something less tangible but equally valuable: a chance for ordinary Territorians to see the world come to their doorstep.</p><p>A thank you to Darwin</p><p>The noise of fighter jets taking off at all hours can certainly test the patience of those living and working near RAAF Base Darwin. Yet the Mindil Beach Flying Display and the free Open Day provided an important opportunity for the Australian Defence Force to give something back to the community that hosts the exercise.</p><p>For three weeks, Darwin put up with the roar of fighter jets overhead. On 23 July, the community was invited to look up and enjoy the spectacle. On 1 August, people were invited through the gates to see the aircraft and meet the people who operate them.</p><p>For the Latvian Association of Darwin, participating in both events was a memorable way to experience the international character of the city in which the Latvian community has made its home.</p><p>From watching fighter jets streak across the sky above Mindil Beach to standing beside them at RAAF Base Darwin, Exercise Pitch Black 2026 offered a unique perspective on Darwin''s place in Australia''s defence landscape.</p><p>And for those of us who occasionally have to stop mid-submission at NT WorkSafe while a fighter jet roars overhead, there is perhaps a different appreciation now.</p><p>After all, if you have to pause your meeting for the noise of a fighter jet, it is rather satisfying to have had the opportunity to see exactly what caused the noise – up close.</p>","body_lv":"","heroImage":"/files/uploads/ce354bffcb941b34dc671.jpeg","ctaLabel_en":"","ctaLabel_lv":"","ctaHref":"","metaTitle_en":"Exercise Pitch Black 2026 – kad Dārvinā ieradās pasaules gaisa spēki","metaTitle_lv":"Exercise Pitch Black 2026 – kad Dārvinā ieradās pasaules gaisa spēki","metaDescription_en":"No iespaidīgās lidojumu parādes virs Mindilas pludmales (Mindil Beach) līdz iespējai klātienē apskatīt iznīcinātājus – Dārvinas Latviešu Apvienības (DLA) biedri piedzīvoja Exercise Pitch Black 2026","metaDescription_lv":"No iespaidīgās lidojumu parādes virs Mindilas pludmales (Mindil Beach) līdz iespējai klātienē apskatīt iznīcinātājus – Dārvinas Latviešu Apvienības (DLA) biedri piedzīvoja Exercise Pitch Black 2026","noIndex":false}', '{}',
  NULL, NULL, NULL, 1788447667, 1788447667
) ON CONFLICT(id) DO UPDATE SET
  type_id = excluded.type_id,
  slug = excluded.slug,
  title = excluded.title,
  sort_order = excluded.sort_order,
  data = excluded.data,
  is_published = 1,
  is_current_draft = 1,
  status = 'published',
  published_at = excluded.published_at,
  updated_at = unixepoch();

DELETE FROM documents WHERE type_id = 'pages' AND slug IS NOT NULL AND slug = 'baltic-way-37' AND is_current_draft = 1 AND id <> 'page-baltic-way-37';
INSERT INTO documents (
  id, root_id, type_id, type_version, version_of_id, version_number,
  is_current_draft, is_published, status, parent_root_id, slug, path, title, zone,
  sort_order, visible, published_at, scheduled_at, expires_at, deleted_at,
  tenant_id, locale, translation_group_id, data, metadata,
  owner_id, created_by, updated_by, created_at, updated_at
) VALUES (
  'page-baltic-way-37', 'page-baltic-way-37', 'pages', 1, NULL, 1,
  1, 1, 'published', '', 'baltic-way-37', NULL, '37th Anniversary of the Baltic Way Commemorated in Darwin', NULL,
  10, 1, 1788447667, NULL, NULL, NULL,
  'default', 'default', '', '{"slug":"baltic-way-37","template":"content","sortOrder":10,"title_en":"37th Anniversary of the Baltic Way Commemorated in Darwin","title_lv":"Dārvinā pieminēta Baltijas ceļa 37. gadadiena","excerpt_en":"The 37th anniversary of the historic Baltic Way was commemorated in Darwin on Sunday, 23 August 2026, with members and friends of the Latvian, Estonian, Lithuanian and Ukrainian communities gathering on the steps of Parliament House to remember one of the most powerful peaceful demonstrations in modern European history.\n\n","excerpt_lv":"Svētdien, 2026. gada 23. augustā, Darvinā tika pieminēta vēsturiskā Baltijas ceļa 37. gadadiena.","body_en":"<p>The 37th anniversary of the historic Baltic Way was commemorated in Darwin on Sunday, 23 August 2026, with members and friends of the Latvian, Estonian, Lithuanian and Ukrainian communities gathering on the steps of Parliament House to remember one of the most powerful peaceful demonstrations in modern European history.</p><p>The commemoration commenced at 3:30 p.m., with those gathered welcomed by the stirring sounds of “Atmostas Baltija”, setting an appropriately solemn and inspirational tone for the afternoon.</p><p>The President of the Latvian Association of Darwin Inc, Reinis Dancis, then addressed those attending, reflecting on the historical significance of the Baltic Way and the courage and determination of the people of Estonia, Latvia and Lithuania.</p><p>On 23 August 1989, approximately two million people joined hands to form a human chain stretching for around 600 kilometres across the three Baltic states, from Tallinn through Riga to Vilnius. The demonstration marked the 50th anniversary of the Molotov–Ribbentrop Pact and its secret protocols, which had led to the occupation and subsequent loss of independence of the Baltic states.</p><p>The Baltic Way became a powerful symbol of the Baltic peoples'' peaceful determination to restore their independence. Less than two years later, Estonia, Latvia and Lithuania had once again regained their independence.</p><p>Following the speech, those gathered in Darwin joined hands in a symbolic recreation of the Baltic Way. Standing together, participants listened to the national anthems of Estonia, Latvia and Lithuania, providing a particularly moving reminder of the shared history, resilience and enduring friendship of the three Baltic nations.</p><p>The commemoration also provided an opportunity to recognise the strong connections between the Baltic and Ukrainian communities in Darwin.</p><p><strong>Ukrainian Independence Day celebrations in Darwin</strong></p><p>Following the Baltic Way ceremony, members of the Latvian Association of Darwin attended the Ukrainian-Australian Association of the Northern Territory (UAANT) Independence Day celebrations at the Darwin Sailing Club.</p><p>The Ukrainian celebration included an address by the Honourable Jinson Charls, Minister for Multicultural Affairs, who spoke about the importance of Ukraine''s independence and the contribution of multicultural communities to the Northern Territory.</p><p>During the celebrations, there was an unexpected and particularly meaningful moment for Reinis Dancis. To his surprise, he was presented with a Certificate of Appreciation by Tatiana Hoffman, President of the UAANT, together with others who had contributed to the association.</p><p>The certificate recognised Reinis “<em>in recognition of his generous support and valuable contribution to the UAANT</em>.”</p><p>Reinis was taken aback by the recognition, describing it as a genuine surprise and a great honour. The gesture reflected not only personal friendship and cooperation between members of the Latvian and Ukrainian communities in Darwin, but also the close relationship that has developed between the two organisations.</p><p>The events of 23 August provided a fitting reminder that the Baltic Way is more than a historical event. Its message of freedom, national self-determination, solidarity and peaceful resistance continues to resonate today.</p><p>For the Baltic communities in Darwin, joining hands once again on 23 August 2026 was a symbolic reaffirmation that the bonds forged through shared history remain strong. The subsequent Ukrainian Independence Day celebrations demonstrated that those bonds extend beyond the Baltic nations, connecting communities that understand the importance of freedom and the right of nations to determine their own future.</p>","body_lv":"<p><strong style=\"color: rgba(0, 0, 0, 0.87); background-color: rgb(255, 255, 255);\">Baltijas vēsturiskā Baltijas ceļa 37. gadadiena tika pieminēta Dārvinā svētdien, 2026. gada 23. augustā.</strong></p><p><br></p><p><strong style=\"color: rgba(0, 0, 0, 0.87); background-color: rgb(255, 255, 255);\">Pie Parlamenta nama kāpnēm pulcējās Latvijas, Igaunijas, Lietuvas un Ukrainas kopienu pārstāvji un draugi, lai atcerētos vienu no nozīmīgākajām miermīlīgajām demonstrācijām mūsdienu Eiropas vēsturē.</strong></p><p><br></p><p><span style=\"color: rgba(0, 0, 0, 0.87); background-color: rgb(255, 255, 255);\">Piemiņas pasākums sākās plkst. 15.30, un klātesošos sagaidīja aizkustinošās dziesmas “</span><em style=\"color: rgba(0, 0, 0, 0.87); background-color: rgb(255, 255, 255);\">Atmostas Baltija</em><span style=\"color: rgba(0, 0, 0, 0.87); background-color: rgb(255, 255, 255);\">” skaņas, radot svinīgu un iedvesmojošu noskaņu.</span></p><p><br></p><p><span style=\"color: rgba(0, 0, 0, 0.87); background-color: rgb(255, 255, 255);\">Dārvinas Latviešu Apvienības priekšsēdis Reinis Dancis uzrunāja klātesošos, atgādinot par Baltijas ceļa vēsturisko nozīmi, kā arī par Igaunijas, Latvijas un Lietuvas tautu drosmi un apņēmību.</span></p><h5 class=\"ql-align-center\"><span style=\"color: rgb(51, 51, 51); background-color: rgb(255, 255, 255);\">Reklāma</span></h5><p><span style=\"color: rgba(0, 0, 0, 0.87); background-color: rgb(255, 255, 255);\">1989. gada 23. augustā aptuveni divi miljoni cilvēku sadevās rokās, izveidojot aptuveni 600 kilometru garu dzīvo ķēdi cauri trim Baltijas valstīm — no Tallinas caur Rīgu līdz Viļņai. Demonstrācija notika, pieminot Molotova–Ribentropa pakta un tā slepeno protokolu 50. gadadienu. Šie līgumi bija noveduši pie Baltijas valstu okupācijas un neatkarības zaudēšanas.</span></p><p><br></p><p><span style=\"color: rgba(0, 0, 0, 0.87); background-color: rgb(255, 255, 255);\">Baltijas ceļš kļuva par spēcīgu Baltijas tautu miermīlīgās apņēmības simbolu atgūt savu neatkarību. Mazāk nekā divus gadus vēlāk Igaunija, Latvija un Lietuva atkal bija atguvušas savu neatkarību.</span></p><p><br></p><p><span style=\"color: rgba(0, 0, 0, 0.87); background-color: rgb(255, 255, 255);\">Pēc uzrunas arī Dārvinā klātesošie sadevās rokās, simboliski atjaunojot Baltijas ceļu. Stāvot plecu pie pleca, dalībnieki noklausījās Igaunijas, Latvijas un Lietuvas valsts himnas, kas bija īpaši aizkustinošs atgādinājums par trīs Baltijas tautu kopīgo vēsturi, izturību un nesaraujamo draudzību.</span></p><p><br></p><p><span style=\"color: rgba(0, 0, 0, 0.87); background-color: rgb(255, 255, 255);\">Piemiņas pasākums bija arī iespēja atzīmēt ciešās saites starp Baltijas un Ukrainas kopienām Darvinā.</span></p><p class=\"ql-align-center\"><br></p><p><strong style=\"color: rgba(0, 0, 0, 0.87); background-color: rgb(255, 255, 255);\">Ukrainas Neatkarības dienas svinības Dārvinā</strong></p><p><br></p><p><span style=\"color: rgba(0, 0, 0, 0.87); background-color: rgb(255, 255, 255);\">Pēc Baltijas ceļa piemiņas pasākuma Latviešu apvienības Darvinā biedri devās uz Ziemeļu Teritorijas Ukraiņu–Austrāliešu apvienības (</span><strong style=\"color: rgba(0, 0, 0, 0.87); background-color: rgb(255, 255, 255);\">UAANT</strong><span style=\"color: rgba(0, 0, 0, 0.87); background-color: rgb(255, 255, 255);\">) Ukrainas Neatkarības dienas svinībām Dārvinas Sailing klubā.</span></p><p><br></p><p><span style=\"color: rgba(0, 0, 0, 0.87); background-color: rgb(255, 255, 255);\">Svinībās uzrunu teica Džinsons Čārls (The Honourable Jinson Charls), Ziemeļu Teritorijas ministrs multikulturālisma jautājumos, kurš runāja par Ukrainas neatkarības nozīmi un multikulturālo kopienu ieguldījumu Ziemeļu Teritorijas dzīvē.</span></p><p><br></p><p><span style=\"color: rgba(0, 0, 0, 0.87); background-color: rgb(255, 255, 255);\">Svinību laikā notika arī negaidīts un īpaši nozīmīgs brīdis Reinim Dancim. Viņam par pārsteigumu UAANT prezidente Tatjana Hofmane (Tatiana Hoffman) pasniedza Atzinības rakstu kopā ar citiem cilvēkiem, kuri bija devuši ieguldījumu UAANT darbībā.</span></p><p><br></p><p><span style=\"color: rgba(0, 0, 0, 0.87); background-color: rgb(255, 255, 255);\">Atzinības raksts Reinim tika pasniegts “</span><em style=\"color: rgba(0, 0, 0, 0.87); background-color: rgb(255, 255, 255);\">par viņa dāsno atbalstu un vērtīgo ieguldījumu UAANT darbībā</em><span style=\"color: rgba(0, 0, 0, 0.87); background-color: rgb(255, 255, 255);\">.”</span></p><p><br></p><p><span style=\"color: rgba(0, 0, 0, 0.87); background-color: rgb(255, 255, 255);\">Reinis bija patiesi pārsteigts par šo atzinību un atzina, ka tā viņam bija negaidīta un liels pagodinājums. Šis žests atspoguļoja ne tikai personīgo draudzību un sadarbību starp Latvijas un Ukrainas kopienu pārstāvjiem Dārvinā, bet arī ciešās attiecības, kas izveidojušās starp abām organizācijām.</span></p><p><br></p><p><span style=\"color: rgba(0, 0, 0, 0.87); background-color: rgb(255, 255, 255);\">23. augusta notikumi bija piemērots atgādinājums, ka Baltijas ceļš nav tikai vēsturisks notikums. Tā vēstījums par brīvību, tautu pašnoteikšanos, solidaritāti un miermīlīgu pretošanos joprojām ir aktuāls arī šodien.</span></p><p><br></p><p><span style=\"color: rgba(0, 0, 0, 0.87); background-color: rgb(255, 255, 255);\">Baltijas kopienām Dārvinā, vēlreiz sadevoties rokās 2026. gada 23. augustā, tas bija simbolisks apliecinājums, ka saites, kas radušās kopīgas vēstures un pieredzes rezultātā, joprojām ir stipras. Savukārt Ukrainas Neatkarības dienas svinības parādīja, ka šīs saites sniedzas pāri Baltijas valstu robežām, savienojot kopienas, kuras izprot brīvības nozīmi un tautu tiesības pašām noteikt savu nākotn</span></p>","heroImage":"/files/uploads/72a4aa0393bb0dc06c2eb.jpg","ctaLabel_en":"","ctaLabel_lv":"","ctaHref":"","metaTitle_en":"37th Anniversary of the Baltic Way Commemorated in Darwin","metaTitle_lv":"37th Anniversary of the Baltic Way Commemorated in Darwin","metaDescription_en":"37th Anniversary of the Baltic Way Commemorated in Darwin","metaDescription_lv":"37th Anniversary of the Baltic Way Commemorated in Darwin","noIndex":false}', '{}',
  NULL, NULL, NULL, 1788447667, 1788447667
) ON CONFLICT(id) DO UPDATE SET
  type_id = excluded.type_id,
  slug = excluded.slug,
  title = excluded.title,
  sort_order = excluded.sort_order,
  data = excluded.data,
  is_published = 1,
  is_current_draft = 1,
  status = 'published',
  published_at = excluded.published_at,
  updated_at = unixepoch();

DELETE FROM documents WHERE type_id = 'pages' AND slug IS NOT NULL AND slug = 'ntfutures2026' AND is_current_draft = 1 AND id <> 'page-ntfutures2026';
INSERT INTO documents (
  id, root_id, type_id, type_version, version_of_id, version_number,
  is_current_draft, is_published, status, parent_root_id, slug, path, title, zone,
  sort_order, visible, published_at, scheduled_at, expires_at, deleted_at,
  tenant_id, locale, translation_group_id, data, metadata,
  owner_id, created_by, updated_by, created_at, updated_at
) VALUES (
  'page-ntfutures2026', 'page-ntfutures2026', 'pages', 1, NULL, 1,
  1, 1, 'published', '', 'ntfutures2026', NULL, 'Imants Kīns – a Latvian voice for the Northern Territory’s future', NULL,
  10, 1, 1788447667, NULL, NULL, NULL,
  'default', 'default', '', '{"slug":"ntfutures2026","template":"content","sortOrder":10,"title_en":"Imants Kīns – a Latvian voice for the Northern Territory’s future","title_lv":"Imants Kīns – latviešu balss Ziemeļu teritorijas nākotnei","excerpt_en":"Imants Kīns continues to advocate an ambitious vision for transforming the Northern Territory’s economy.","excerpt_lv":"Īpašā ekonomiskā zona Ziemeļu teritorijai\n","body_en":"<p>The fifth annual Future Northern Territory economic forum, hosted by the <em>NT News</em>, took place on Thursday, 16 July 2026, at the Mindil Beach Casino Resort in Darwin. The event brought together more than 350 industry and community leaders to discuss the Territory’s future, including regional growth, energy, housing and workforce challenges.</p><p><br></p><p>Among the speakers was Latvian-Australian businessman and community leader Imants Kīns, Co-Chair of <em>Australians for Northern Development &amp; Economic Vision</em> (ANDEV).</p><p><br></p><p>This was not Imants’ first major appearance at a Northern Territory economic forum. He had also participated in the NT News Bush Summit in Darwin on 1 September 2025, where he presented his proposal for a Territory-wide Special Economic Zone. His proposal was subsequently included in the Bush Summit’s final communiqué.</p><p><br></p><p><strong>A Special Economic Zone for the NT</strong></p><p><br></p><p>At this year’s forum, Imants continued to advocate an ambitious vision for transforming the Territory’s economy. His central proposal is that the entire Northern Territory should become a Special Economic Zone (SEZ), with lower taxes, less regulation and faster approval processes to attract investment, create jobs and encourage economic growth.</p><p><br></p><p>Writing in the <em>NT News</em>, Imants argued that the Territory’s enormous natural resources and strategic location are being underutilised. He pointed out that almost 8000 SEZs operate around the world, while Australia has none.</p><p><br></p><p><strong>Cutting red tape</strong></p><p><br></p><p>A central part of Imants’ argument is that reducing tax alone will not be enough. Governments must also cut red tape, simplify regulations, reduce bureaucracy and dramatically speed up approval processes.</p><p><br></p><p>For businesses considering major investments, lengthy and complicated approval processes can add significant costs and uncertainty. Imants argues that the Northern Territory needs to become a place where investors are welcomed, projects can proceed efficiently and businesses can compete internationally.</p><p><br></p><p>His proposal also includes developing a defence-industry ecosystem around Darwin and Tindal, with Australian and allied companies encouraged to establish businesses close to existing defence infrastructure.</p><p><br></p><p>This is a message that has relevance well beyond the Northern Territory.</p><p><br></p><p>As a Latvian-Australian, I could not help but think that the same principle applies to Latvia. Reducing unnecessary bureaucracy and simplifying regulations should not be regarded as an Australian issue alone. Latvia, like Australia, needs to remain competitive in attracting investment, encouraging entrepreneurship and creating</p><p>opportunities for its people.</p><p><br></p><p>The challenge for governments in both countries is to ensure that regulation protects the public interest without unnecessarily making it harder for businesses and individuals to invest, innovate and create employment.</p><p><br></p><p>Interestingly, Imants cited Latvia in his <em>NT News</em> article as an example of a country where Special Economic Zones can provide companies with favourable tax arrangements.</p><p><br></p><p><strong>A meeting of Australian Latvians</strong></p><p><br></p><p>Following the 2025 Bush Summit, Imants also took the opportunity to meet with Reinis Dancis, President of the Latvian Association of Darwin, on 2 September 2025.</p><p><br></p><p>The meeting provided an opportunity for two Latvian-Australians to discuss the Northern Territory’s economic future, as well as the Latvian community and its activities in Darwin and across Australia.</p><p><br></p><p>Imants is also Latvia’s Honorary Consul in Western Australia, giving him an important role in maintaining connections between Latvia and the Latvian community in Australia.</p><p><br></p><p>For the Latvian community in Darwin, it was a pleasure to see one of our own contributing to an important discussion about the future of the Northern Territory.</p><p><br></p><p>Whether Imants’ proposal for a Territory-wide Special Economic Zone becomes reality remains to be seen. But his message has remained consistent from last year’s Bush Summit to this year’s <em>Future Northern Territory</em> forum: the Northern Territory has enormous potential, and unlocking that potential requires bold thinking, lower barriers to investment and much less unnecessary red tape.</p><p><br></p><p>It is a message that resonates not only in the Northern Territory, but also in Latvia — and perhaps in many other places where governments are seeking to encourage investment, innovation and prosperity.</p>","body_lv":"<p>Piektais ikgadējais “Future Northern Territory” ekonomikas forums, ko organizēja NT News, notika 2026. gada 16. jūlijā, ceturtdien, Mindil Beach Casino Resort Dārvinā. Pasākumā pulcējās vairāk nekā 350 uzņēmējdarbības, sabiedrības un citu nozaru līderu, lai apspriestu Ziemeļu teritorijas nākotni, tostarp reģiona izaugsmi, enerģētiku, mājokļu pieejamību un darbaspēka problēmas.</p><p><br></p><p>Starp foruma runātājiem bija latviešu izcelsmes Austrālijas uzņēmējs un sabiedriskais līderis Imants Kīns, organizācijas Australians for Northern Development &amp; Economic Vision (ANDEV) līdzpriekšsēdētājs.</p><p><br></p><p>Šī nebija Imanta pirmā uzstāšanās nozīmīgā Ziemeļu teritorijas ekonomikas forumā. Viņš piedalījās arī NT News Bush Summit, kas 2025. gada 1. septembrī notika Dārvinā, kur prezentēja savu priekšlikumu par īpašās ekonomiskās zonas izveidi visā Ziemeļu teritorijā. Viņa priekšlikums vēlāk tika iekļauts Bush Summit gala paziņojumā.</p><p><br></p><p><strong>Īpašā ekonomiskā zona Ziemeļu teritorijai</strong></p><p><br></p><p>Šā gada forumā Imants turpināja aizstāvēt ambiciozu redzējumu par Ziemeļu teritorijas ekonomikas pārveidi. Viņa galvenais priekšlikums ir noteikt visu Ziemeļu teritoriju par īpašo ekonomisko zonu (SEZ), paredzot zemākus nodokļus, mazāku regulējumu un ātrākus apstiprināšanas procesus, lai piesaistītu investīcijas, radītu darbavietas un veicinātu ekonomisko izaugsmi.</p><p><br></p><p>Savā NT News publicētajā rakstā Imants norādīja, ka Ziemeļu teritorijas milzīgie dabas resursi un stratēģiskais novietojums netiek pietiekami izmantoti. Viņš uzsvēra, ka visā pasaulē darbojas gandrīz 8000 īpašo ekonomisko zonu, kamēr Austrālijā tādu nav.</p><p><br></p><p>Birokrātijas un liekās regulācijas mazināšana</p><p><br></p><p>Imanta argumentācijas būtiska sastāvdaļa ir atziņa, ka ar nodokļu samazināšanu vien nepietiks. Valdībām ir arī jāsamazina birokrātija, jāvienkāršo noteikumi, jāmazina liekā regulācija un būtiski jāpaātrina projektu apstiprināšanas procesi.</p><p><br></p><p>Uzņēmumiem, kas apsver lielas investīcijas, ilgstoši un sarežģīti apstiprināšanas procesi var radīt ievērojamas papildu izmaksas un nenoteiktību. Imants uzskata, ka Ziemeļu teritorijai jākļūst par vietu, kur investori ir gaidīti, projekti var tikt īstenoti efektīvi un uzņēmumi var konkurēt starptautiskā mērogā.</p><p><br></p><p>Viņa priekšlikums paredz arī aizsardzības industrijas ekosistēmas attīstību ap Dārvinā un Tindalā esošo infrastruktūru, mudinot Austrālijas un sabiedroto valstu uzņēmumus veidot savu darbību tuvumā esošajām aizsardzības infrastruktūras iespējām.</p><p><br></p><p>Šis vēstījums ir nozīmīgs ne tikai Ziemeļu teritorijai.</p><p><br></p><p>Kā latviešu izcelsmes austrālietis es nevarēju nedomāt, ka tas pats princips attiecas arī uz Latviju. Liekas birokrātijas mazināšanu un noteikumu vienkāršošanu nevajadzētu uzskatīt tikai par Austrālijas problēmu. Arī Latvijai ir jāpaliek konkurētspējīgai investīciju piesaistē, uzņēmējdarbības veicināšanā un jaunu iespēju radīšanā saviem iedzīvotājiem.</p><p><br></p><p>Gan Austrālijas, gan Latvijas valdību izaicinājums ir nodrošināt, lai regulējums aizsargātu sabiedrības intereses, vienlaikus neradot nevajadzīgus šķēršļus uzņēmumiem un privātpersonām investēt, ieviest jauninājumus un radīt darbavietas.</p><p><br></p><p>Interesanti, ka savā NT News rakstā Imants minēja Latviju kā piemēru valstij, kur īpašās ekonomiskās zonas uzņēmumiem var nodrošināt labvēlīgākus nodokļu nosacījumus.</p><p><br></p><p><strong>Divu Austrālijas latviešu tikšanās</strong></p><p><br></p><p>Pēc foruma Imants izmantoja iespēju tikties arī ar Reini Danci, Dārvinas Latviešu Apvienības priekšsēdi.</p><p><br></p><p>Tikšanās Darwin Sailing Klubā deva iespēju diviem latviešu izcelsmes austrāliešiem pārrunāt Ziemeļu teritorijas ekonomisko nākotni, kā arī latviešu kopienu un tās darbību Dārvinā un visā Austrālijā.</p><p><br></p><p>Imants ir arī Latvijas goda konsuls Rietumaustrālijā, un šajā amatā viņam ir nozīmīga loma Latvijas un Austrālijas latviešu kopienas saišu uzturēšanā.</p><p><br></p><p>Dārvinas latviešu kopienai bija atkal patiess prieks redzēt vienu no savējiem aktīvi piedalāmies svarīgā diskusijā par Ziemeļu teritorijas nākotni.</p><p><br></p><p>Vai Imanta priekšlikums par īpašās ekonomiskās zonas izveidi visā Ziemeļu teritorijā kļūs par realitāti, vēl ir jāredz. Taču viņa vēstījums no pagājušā gada Bush Summit līdz šā gada Future Northern Territory forumam ir palicis nemainīgs: Ziemeļu teritorijai ir milzīgs potenciāls, un tā atraisīšanai nepieciešama drosmīga domāšana, mazāki šķēršļi investīcijām un daudz mazāk nevajadzīgas birokrātijas.</p><p><br></p><p>Tas ir vēstījums, kas rezonē ne tikai Ziemeļu teritorijā, bet arī Latvijā — un, iespējams, daudzās citās vietās, kur valdības cenšas veicināt investīcijas, inovācijas un labklājību</p>","heroImage":"/files/uploads/c783e78bc74af3cfc7549.webp","ctaLabel_en":"","ctaLabel_lv":"","ctaHref":"","metaTitle_en":"Imants Kīns","metaTitle_lv":"Imants Kīns","metaDescription_en":"Imants Kīns continues to advocate an ambitious vision for transforming the Northern Territory’s economy.","metaDescription_lv":"Imants Kīns continues to advocate an ambitious vision for transforming the Northern Territory’s economy.","noIndex":false}', '{}',
  NULL, NULL, NULL, 1788447667, 1788447667
) ON CONFLICT(id) DO UPDATE SET
  type_id = excluded.type_id,
  slug = excluded.slug,
  title = excluded.title,
  sort_order = excluded.sort_order,
  data = excluded.data,
  is_published = 1,
  is_current_draft = 1,
  status = 'published',
  published_at = excluded.published_at,
  updated_at = unixepoch();

DELETE FROM documents WHERE type_id = 'pages' AND slug IS NOT NULL AND slug = 'history' AND is_current_draft = 1 AND id <> 'page-history';
INSERT INTO documents (
  id, root_id, type_id, type_version, version_of_id, version_number,
  is_current_draft, is_published, status, parent_root_id, slug, path, title, zone,
  sort_order, visible, published_at, scheduled_at, expires_at, deleted_at,
  tenant_id, locale, translation_group_id, data, metadata,
  owner_id, created_by, updated_by, created_at, updated_at
) VALUES (
  'page-history', 'page-history', 'pages', 1, NULL, 1,
  1, 1, 'published', '', 'history', NULL, 'Our History', NULL,
  20, 1, 1788447667, NULL, NULL, NULL,
  'default', 'default', '', '{"slug":"history","template":"content","sortOrder":20,"title_en":"Our History","title_lv":"Mūsu vēsture","excerpt_en":"From informal gatherings in the 1980s to an incorporated association serving the Top End today.","excerpt_lv":"No neformālām tikšanās reizēm 20. gadsimta astoņdesmitajos gados līdz reģistrētai Top End kopienas organizācijai.","body_en":"The Latvian Association of Darwin is one of Australia''s newest Latvian community organisations. It was officially incorporated on 22 August 2023 to support the growing Latvian community in the Northern Territory.\n\nThe Association builds on informal cultural, social, and commemorative gatherings held by Latvians in Darwin since the 1980s. National day celebrations, cultural events, and diaspora commemorations created the foundation for a permanent organisation.\n\nToday the Association honours that history while building a welcoming, active community for future generations.","body_lv":"Dārvinas Latviešu Apvienība ir viena no Austrālijas jaunākajām latviešu kopienas organizācijām. Tā tika oficiāli reģistrēta 2023. gada 22. augustā, lai atbalstītu augošo latviešu kopienu Ziemeļu Teritorijā.\n\nApvienība turpina neformālo kultūras, sabiedrisko un piemiņas pasākumu tradīciju, ko Dārvinā dzīvojošie latvieši veidojuši kopš 20. gadsimta astoņdesmitajiem gadiem. Valsts svētki, kultūras sarīkojumi un diasporas piemiņas dienas radīja pamatu pastāvīgai organizācijai.\n\nŠodien Apvienība godina šo vēsturi un vienlaikus veido aktīvu, atvērtu kopienu nākamajām paaudzēm.","heroImage":"/files/uploads/9cb8354371d97d91120d1.jpg","ctaLabel_en":"","ctaLabel_lv":"","ctaHref":"","metaTitle_en":"Our History","metaTitle_lv":"Our History","metaDescription_en":"From informal gatherings in the 1980s to an incorporated association serving the Top End today.","metaDescription_lv":"From informal gatherings in the 1980s to an incorporated association serving the Top End today.","noIndex":false}', '{}',
  NULL, NULL, NULL, 1788447667, 1788447667
) ON CONFLICT(id) DO UPDATE SET
  type_id = excluded.type_id,
  slug = excluded.slug,
  title = excluded.title,
  sort_order = excluded.sort_order,
  data = excluded.data,
  is_published = 1,
  is_current_draft = 1,
  status = 'published',
  published_at = excluded.published_at,
  updated_at = unixepoch();

DELETE FROM documents WHERE type_id = 'pages' AND slug IS NOT NULL AND slug = 'community' AND is_current_draft = 1 AND id <> 'page-community';
INSERT INTO documents (
  id, root_id, type_id, type_version, version_of_id, version_number,
  is_current_draft, is_published, status, parent_root_id, slug, path, title, zone,
  sort_order, visible, published_at, scheduled_at, expires_at, deleted_at,
  tenant_id, locale, translation_group_id, data, metadata,
  owner_id, created_by, updated_by, created_at, updated_at
) VALUES (
  'page-community', 'page-community', 'pages', 1, NULL, 1,
  1, 1, 'published', '', 'community', NULL, 'Our Community', NULL,
  30, 1, 1788447667, NULL, NULL, NULL,
  'default', 'default', '', '{"slug":"community","template":"content","sortOrder":30,"title_en":"Our Community","title_lv":"Mūsu kopiena","excerpt_en":"Discover the gatherings, cultural connections, and practical support that bring our Top End community together.","excerpt_lv":"Uzziniet par tikšanās reizēm, kultūras saitēm un praktisko atbalstu, kas vieno mūsu Top End kopienu.","body_en":"Our community includes recent arrivals, long-established families, Latvian descendants, and friends who share an interest in Latvia and Baltic culture.\n\nWe create opportunities to meet through seasonal celebrations, national commemorations, shared meals, family activities, and informal social gatherings. These occasions help newcomers form connections and give established members a place to maintain language and traditions.\n\nThe Association also connects members with Latvian organisations elsewhere in Australia and supports community-led ideas that keep our culture visible in the Northern Territory.","body_lv":"Mūsu kopienā ir gan nesen ieradušies, gan sen dzīvojošas ģimenes, latviešu pēcnācēji un draugi, kurus interesē Latvija un Baltijas kultūra.\n\nMēs tiekamies gadskārtu svētkos, valsts piemiņas dienās, kopīgās maltītēs, ģimeņu pasākumos un neformālās tikšanās reizēs. Šie brīži palīdz jaunpienācējiem veidot kontaktus un dod iespēju saglabāt valodu un tradīcijas.\n\nApvienība veido saites arī ar latviešu organizācijām citviet Austrālijā un atbalsta kopienas idejas, kas dara mūsu kultūru redzamu Ziemeļu Teritorijā.","heroImage":"/files/uploads/32ad35a30fbb6bcd94bfb.jpg","ctaLabel_en":"","ctaLabel_lv":"","ctaHref":"","metaTitle_en":"Our Community","metaTitle_lv":"Our Community","metaDescription_en":"Discover the gatherings, cultural connections, and practical support that bring our Top End community together.","metaDescription_lv":"Discover the gatherings, cultural connections, and practical support that bring our Top End community together.","noIndex":false}', '{}',
  NULL, NULL, NULL, 1788447667, 1788447667
) ON CONFLICT(id) DO UPDATE SET
  type_id = excluded.type_id,
  slug = excluded.slug,
  title = excluded.title,
  sort_order = excluded.sort_order,
  data = excluded.data,
  is_published = 1,
  is_current_draft = 1,
  status = 'published',
  published_at = excluded.published_at,
  updated_at = unixepoch();

DELETE FROM documents WHERE type_id = 'pages' AND slug IS NOT NULL AND slug = 'membership' AND is_current_draft = 1 AND id <> 'page-membership';
INSERT INTO documents (
  id, root_id, type_id, type_version, version_of_id, version_number,
  is_current_draft, is_published, status, parent_root_id, slug, path, title, zone,
  sort_order, visible, published_at, scheduled_at, expires_at, deleted_at,
  tenant_id, locale, translation_group_id, data, metadata,
  owner_id, created_by, updated_by, created_at, updated_at
) VALUES (
  'page-membership', 'page-membership', 'pages', 1, NULL, 1,
  1, 1, 'published', '', 'membership', NULL, 'Join the Association', NULL,
  40, 1, 1788447667, NULL, NULL, NULL,
  'default', 'default', '', '{"slug":"membership","template":"content","sortOrder":40,"title_en":"Join the Association","title_lv":"Pievienojieties apvienībai","excerpt_en":"Become part of the Association, contribute your ideas, and help Latvian culture thrive in Darwin.","excerpt_lv":"Kļūstiet par Apvienības daļu, dalieties idejās un palīdziet latviešu kultūrai Dārvinā attīstīties.","body_en":"Membership is open to people who support the aims of the Latvian Association of Darwin. Latvian heritage is welcome but not required.\n\nMembers can take part in planning activities, contribute ideas, volunteer at events, and help shape the Association as it grows. You can also begin by attending an event and meeting the community before deciding to join.","body_lv":"Par biedru var kļūt ikviens, kurš atbalsta Dārvinas Latviešu Apvienības mērķus. Latviska izcelsme ir gaidīta, bet nav obligāta.\n\nBiedri var piedalīties aktivitāšu plānošanā, ierosināt idejas, palīdzēt pasākumos un veidot Apvienības nākotni. Pirms iestāšanās varat arī apmeklēt kādu pasākumu un iepazīt kopienu.","heroImage":"/files/uploads/3b09fa70a9e1a257df835.webp","ctaLabel_en":"Email the Association","ctaLabel_lv":"Rakstīt apvienībai","ctaHref":"mailto:hello@darwinlatvians.org","metaTitle_en":"Join the Association","metaTitle_lv":"Join the Association","metaDescription_en":"Become part of the Association, contribute your ideas, and help Latvian culture thrive in Darwin.","metaDescription_lv":"Become part of the Association, contribute your ideas, and help Latvian culture thrive in Darwin.","noIndex":false}', '{}',
  NULL, NULL, NULL, 1788447667, 1788447667
) ON CONFLICT(id) DO UPDATE SET
  type_id = excluded.type_id,
  slug = excluded.slug,
  title = excluded.title,
  sort_order = excluded.sort_order,
  data = excluded.data,
  is_published = 1,
  is_current_draft = 1,
  status = 'published',
  published_at = excluded.published_at,
  updated_at = unixepoch();

DELETE FROM documents WHERE type_id = 'pages' AND slug IS NOT NULL AND slug = 'culture' AND is_current_draft = 1 AND id <> 'page-culture';
INSERT INTO documents (
  id, root_id, type_id, type_version, version_of_id, version_number,
  is_current_draft, is_published, status, parent_root_id, slug, path, title, zone,
  sort_order, visible, published_at, scheduled_at, expires_at, deleted_at,
  tenant_id, locale, translation_group_id, data, metadata,
  owner_id, created_by, updated_by, created_at, updated_at
) VALUES (
  'page-culture', 'page-culture', 'pages', 1, NULL, 1,
  1, 1, 'published', '', 'culture', NULL, 'Culture & Traditions', NULL,
  50, 1, 1788447667, NULL, NULL, NULL,
  'default', 'default', '', '{"slug":"culture","template":"content","sortOrder":50,"title_en":"Culture & Traditions","title_lv":"Kultūra un tradīcijas","excerpt_en":"Explore the vibrant Latvian heritage, from song and dance festivals to seasonal celebrations kept alive in Darwin.","excerpt_lv":"Iepazīstiet dzīvīgo latviešu mantojumu, no dziesmu un deju svētkiem līdz gadskārtu svinībām Dārvinā.","body_en":"Latvian culture is deeply rooted in history, nature, and community. In Darwin, we actively preserve and celebrate our unique traditions, keeping them alive for future generations and sharing them with the wider Australian community.\n\nFrom the traditional summer solstice celebration of Jāņi with its flower crowns, songs, and bonfires, to celebrating national holidays, we cherish our rich heritage. We also maintain connections with the broader Latvian diaspora in Australia, participating in regional song festivals, cultural events, and youth gatherings.\n\nTraditional crafts, folk dancing, and singing are at the heart of our community life, offering a bridge between Latvia and our home in the Northern Territory.","body_lv":"Latviešu kultūra ir cieši saistīta ar vēsturi, dabu un kopienu. Dārvinā mēs aktīvi saglabājam un kopjam savas unikālās tradīcijas, nododot tās nākamajām paaudzēm un daloties tajās ar plašāku Austrālijas sabiedrību.\n\nNo tradicionālajām vasaras saulgriežu svinībām – Jāņiem ar vainagu pīšanu, dziesmām un ugunskuriem, līdz valsts svētku atzīmēšanai – mēs godinām mūsu bagāto mantojumu. Mēs arī uzturam saites ar plašāku latviešu diasporu Austrālijā, piedaloties reģionālos dziesmu svētkos, kultūras pasākumos un jauniešu salidojumos.\n\nTradicionālie amatniecības izstrādājumi, tautas dejas un dziedāšana ir mūsu kopienas dzīves centrā, nodrošinot tiltu starp Latviju un mūsu mājām Ziemeļu Teritorijā.","heroImage":"/files/uploads/58a0b3d51187c368496cf.png","ctaLabel_en":"","ctaLabel_lv":"","ctaHref":"","metaTitle_en":"Culture & Traditions","metaTitle_lv":"Kultūra un tradīcijas","metaDescription_en":"Explore the vibrant Latvian heritage, from song and dance festivals to seasonal celebrations kept alive in Darwin.","metaDescription_lv":"Iepazīstiet dzīvīgo latviešu mantojumu, no dziesmu un deju svētkiem līdz gadskārtu svinībām Dārvinā.","noIndex":false}', '{}',
  NULL, NULL, NULL, 1788447667, 1788447667
) ON CONFLICT(id) DO UPDATE SET
  type_id = excluded.type_id,
  slug = excluded.slug,
  title = excluded.title,
  sort_order = excluded.sort_order,
  data = excluded.data,
  is_published = 1,
  is_current_draft = 1,
  status = 'published',
  published_at = excluded.published_at,
  updated_at = unixepoch();

DELETE FROM documents WHERE type_id = 'pages' AND slug IS NOT NULL AND slug = 'about' AND is_current_draft = 1 AND id <> 'page-about';
INSERT INTO documents (
  id, root_id, type_id, type_version, version_of_id, version_number,
  is_current_draft, is_published, status, parent_root_id, slug, path, title, zone,
  sort_order, visible, published_at, scheduled_at, expires_at, deleted_at,
  tenant_id, locale, translation_group_id, data, metadata,
  owner_id, created_by, updated_by, created_at, updated_at
) VALUES (
  'page-about', 'page-about', 'pages', 1, NULL, 1,
  1, 1, 'published', '', 'about', NULL, 'About the Association', NULL,
  60, 1, 1788447667, NULL, NULL, NULL,
  'default', 'default', '', '{"slug":"about","template":"simple","sortOrder":60,"title_en":"About the Association","title_lv":"Par apvienību","body_en":"The Latvian Association of Darwin (Dārvinas Latviešu Apvienība) is a community organisation dedicated to bringing together Latvians, Latvian descendants, and friends of Latvia across the Northern Territory. We provide a welcoming place where culture, language, and traditions can be shared, preserved, and enjoyed.\n\nOur community supports cooperation among Latvians in Darwin, across Australia, and with organisations in Latvia and around the world. Cultural events, social gatherings, educational activities, and community initiatives strengthen our shared identity and create a sense of belonging.\n\nWhether you have Latvian heritage, an interest in Baltic culture, or simply want to connect with a vibrant multicultural community, you are welcome.","body_lv":"Dārvinas Latviešu Apvienība ir kopienas organizācija, kas apvieno latviešus, latviešu pēcnācējus un Latvijas draugus visā Ziemeļu Teritorijā. Mēs piedāvājam draudzīgu vietu, kur kultūra, valoda un tradīcijas tiek kopīgotas, saglabātas un baudītas.\n\nMūsu kopiena veicina sadarbību starp latviešiem Dārvinā, visā Austrālijā un ar organizācijām Latvijā un pasaulē. Kultūras pasākumi, saviesīgas tikšanās, izglītojošas aktivitātes un kopienas iniciatīvas stiprina mūsu kopīgo identitāti un piederības sajūtu.\n\nNeatkarīgi no tā, vai esat latvietis, kurš nesen ieradies Ziemeļu Teritorijā, pēcnācējs, kurš vēlas atjaunot saikni ar savu mantojumu, vai vietējais iedzīvotājs, kuram interesē latviešu kultūra – mūsu durvis ir atvērtas.","heroImage":null,"ctaLabel_en":"","ctaLabel_lv":"","ctaHref":"","metaTitle_en":"About the Association","metaTitle_lv":"Par apvienību","metaDescription_en":"","metaDescription_lv":"","noIndex":false}', '{}',
  NULL, NULL, NULL, 1788447667, 1788447667
) ON CONFLICT(id) DO UPDATE SET
  type_id = excluded.type_id,
  slug = excluded.slug,
  title = excluded.title,
  sort_order = excluded.sort_order,
  data = excluded.data,
  is_published = 1,
  is_current_draft = 1,
  status = 'published',
  published_at = excluded.published_at,
  updated_at = unixepoch();

DELETE FROM documents WHERE type_id = 'pages' AND slug IS NOT NULL AND slug = 'contact' AND is_current_draft = 1 AND id <> 'page-contact';
INSERT INTO documents (
  id, root_id, type_id, type_version, version_of_id, version_number,
  is_current_draft, is_published, status, parent_root_id, slug, path, title, zone,
  sort_order, visible, published_at, scheduled_at, expires_at, deleted_at,
  tenant_id, locale, translation_group_id, data, metadata,
  owner_id, created_by, updated_by, created_at, updated_at
) VALUES (
  'page-contact', 'page-contact', 'pages', 1, NULL, 1,
  1, 1, 'published', '', 'contact', NULL, 'Contact Us', NULL,
  70, 1, 1788447667, NULL, NULL, NULL,
  'default', 'default', '', '{"slug":"contact","template":"simple","sortOrder":70,"title_en":"Contact Us","title_lv":"Kontakti","body_en":"We would love to hear from you! Whether you are a Latvian newly arrived in the Northern Territory, a descendant wishing to reconnect with your heritage, or a local resident interested in Latvian culture, our door is always open.\n\nYou can reach out to us via email for general inquiries, membership applications, or event details. We also encourage you to follow our social media channels to stay updated on upcoming community gatherings and initiatives.\n\nLet''s connect and build a stronger community together in the Top End!\n\nEmail: support@latviansofdarwin.org.au","body_lv":"Mēs priecāsimies par jūsu ziņām! Neatkarīgi no tā, vai esat latvietis, kurš nesen ieradies Ziemeļu Teritorijā, pēcnācējs, kurš vēlas atjaunot saikni ar savu mantojumu, vai vietējais iedzīvotājs, kuram interesē latviešu kultūra – mūsu durvis ir atvērtas.\n\nSazinieties ar mums pa e-pastu, lai uzdotu jautājumus, pieteiktos dalībai apvienībā vai uzzinātu par pasākumiem. Tāpat aicinām sekot mūsu sociālo tīklu profiliem, lai uzzinātu jaunumus par nākamiem kopienas sarīkojumiem un iniciatīvām.\n\nSazināsimies un veidosim stiprāku kopienu kopā Ziemeļu Teritorijā!\n\nE-pasts: support@latviansofdarwin.org.au","heroImage":null,"ctaLabel_en":"","ctaLabel_lv":"","ctaHref":"","metaTitle_en":"Contact Us","metaTitle_lv":"Kontakti","metaDescription_en":"","metaDescription_lv":"","noIndex":false}', '{}',
  NULL, NULL, NULL, 1788447667, 1788447667
) ON CONFLICT(id) DO UPDATE SET
  type_id = excluded.type_id,
  slug = excluded.slug,
  title = excluded.title,
  sort_order = excluded.sort_order,
  data = excluded.data,
  is_published = 1,
  is_current_draft = 1,
  status = 'published',
  published_at = excluded.published_at,
  updated_at = unixepoch();

DELETE FROM documents WHERE type_id = 'pages' AND slug IS NOT NULL AND slug = 'privacy' AND is_current_draft = 1 AND id <> 'page-privacy';
INSERT INTO documents (
  id, root_id, type_id, type_version, version_of_id, version_number,
  is_current_draft, is_published, status, parent_root_id, slug, path, title, zone,
  sort_order, visible, published_at, scheduled_at, expires_at, deleted_at,
  tenant_id, locale, translation_group_id, data, metadata,
  owner_id, created_by, updated_by, created_at, updated_at
) VALUES (
  'page-privacy', 'page-privacy', 'pages', 1, NULL, 1,
  1, 1, 'published', '', 'privacy', NULL, 'Privacy Policy', NULL,
  80, 1, 1788447667, NULL, NULL, NULL,
  'default', 'default', '', '{"slug":"privacy","template":"simple","sortOrder":80,"title_en":"Privacy Policy","title_lv":"Privātuma politika","body_en":"Latvian Association of Darwin (DLA) respects your privacy and handles personal information responsibly.\n\nInformation We Collect\nWe may collect contact details you provide directly to us (such as your email address), and minimal technical information required to operate the website.\n\nCookies and Analytics\nThis website may use minimal analytics cookies to understand how visitors use our site. These analytics cookies are optional and you can clear your browser data to reset any preferences. All data is anonymized.\n\nHow We Use Information\n- Respond to community inquiries\n- Share event and community updates\n- Improve website functionality\n\nData Sharing\nWe do not sell personal information. We only share information when required by law or with trusted service providers needed to run DLA services.\n\nYour Rights\nYou have the right to request access to any personal information we hold about you, or request correction or deletion of your personal information.\n\nContact\nFor privacy questions or requests, contact us at hello@darwinlatvians.org.","body_lv":"Dārvinas Latviešu Apvienība (DLA) ciena jūsu privātumu un atbildīgi apstrādā personisko informāciju.\n\nInformācija, ko mēs vācam\nMēs varam vākt kontaktinformāciju, ko sniedzat tieši mums (piemēram, jūsu e-pasta adresi), un minimālo tehnisko informāciju, kas nepieciešama tīmekļa vietnes darbībai.\n\nSīkfaili un analīze\nŠī vietne var izmantot minimālus analītiskos sīkfailus, lai saprastu, kā apmeklētāji izmanto mūsu vietni. Šie sīkfaili ir neobligāti. Visi dati tiek anonimizēti.\n\nKā mēs izmantojam informāciju\n- Atbildēt uz kopienas pieprasījumiem\n- Kopīgot informāciju par pasākumiem un kopienas jaunumiem\n- Uzlabot tīmekļa vietnes darbību\n\nDatu kopīgošana\nMēs nepārdodam personisko informāciju. Mēs kopīgojam informāciju tikai tad, ja to pieprasa likums, vai ar uzticamiem pakalpojumu sniedzējiem, kas nepieciešami DLA pakalpojumu nodrošināšanai.\n\nJūsu tiesības\nJums ir tiesības pieprasīt piekļuvi jebkurai personiskajai informācijai, ko mēs glabājam par jums, vai pieprasīt jūsu personiskās informācijas labošanu vai dzēšanu.\n\nSaziņa\nJa jums ir jautājumi par privātumu, sazinieties ar mums pa e-pastu hello@darwinlatvians.org.","heroImage":null,"ctaLabel_en":"","ctaLabel_lv":"","ctaHref":"","metaTitle_en":"Privacy Policy","metaTitle_lv":"Privātuma politika","metaDescription_en":"","metaDescription_lv":"","noIndex":false}', '{}',
  NULL, NULL, NULL, 1788447667, 1788447667
) ON CONFLICT(id) DO UPDATE SET
  type_id = excluded.type_id,
  slug = excluded.slug,
  title = excluded.title,
  sort_order = excluded.sort_order,
  data = excluded.data,
  is_published = 1,
  is_current_draft = 1,
  status = 'published',
  published_at = excluded.published_at,
  updated_at = unixepoch();

DELETE FROM documents WHERE type_id = 'pages' AND slug IS NOT NULL AND slug = 'terms' AND is_current_draft = 1 AND id <> 'page-terms';
INSERT INTO documents (
  id, root_id, type_id, type_version, version_of_id, version_number,
  is_current_draft, is_published, status, parent_root_id, slug, path, title, zone,
  sort_order, visible, published_at, scheduled_at, expires_at, deleted_at,
  tenant_id, locale, translation_group_id, data, metadata,
  owner_id, created_by, updated_by, created_at, updated_at
) VALUES (
  'page-terms', 'page-terms', 'pages', 1, NULL, 1,
  1, 1, 'published', '', 'terms', NULL, 'Terms & Conditions', NULL,
  90, 1, 1788447667, NULL, NULL, NULL,
  'default', 'default', '', '{"slug":"terms","template":"simple","sortOrder":90,"title_en":"Terms & Conditions","title_lv":"Lietošanas noteikumi","body_en":"Welcome to the Latvian Association of Darwin (DLA) website. By accessing or using this website, you agree to comply with and be bound by these Terms & Conditions.\n\nWebsite Content\nAll content, branding, images, and materials on this website are the intellectual property of the Latvian Association of Darwin, unless otherwise stated. You may not reproduce, distribute, or reuse any materials without our prior written permission.\n\nUse of Website\nYou agree to use this website only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else''s use and enjoyment of the website.\n\nThird-Party Links\nOur website may contain links to external websites. DLA is not responsible for the content, privacy policies, or practices of any third-party websites.\n\nLimitation of Liability\nWhile we strive to keep information accurate and up-to-date, DLA makes no representations or warranties of any kind about the completeness, accuracy, or availability of the website content. Your use of this website is at your own risk.\n\nContact\nIf you have any questions about these Terms & Conditions, please contact us at hello@darwinlatvians.org.","body_lv":"Laipni lūdzam Dārvinas Latviešu Apvienības (DLA) tīmekļa vietnē. Piekļūstot šai vietnei vai izmantojot to, jūs piekrītat ievērot šos lietošanas noteikumus.\n\nVietnes saturs\nViss saturs, zīmols, attēli un materiāli šajā vietnē ir Dārvinas Latviešu Apvienības intelektuālais īpašums, ja vien nav norādīts citādi. Jūs nedrīkstat reproducēt, izplatīt vai atkārtoti izmantot nekādus materiālus bez mūsu iepriekšējas rakstiskas atļaujas.\n\nVietnes izmantošana\nJūs piekrītat izmantot šo vietni tikai likumīgiem mērķiem un tādā veidā, kas nepārkāpj citu personu tiesības, neierobežo un nekavē vietnes izmantošanu.\n\nTrešo pušu saites\nMūsu vietnē var būt saites uz ārējām vietnēm. DLA neatbild par trešo pušu vietņu saturu, privātuma politikām vai praksi.\n\nAtbildības ierobežojums\nLai gan mēs cenšamies nodrošināt informācijas precizitāti, DLA nesniedz nekādas garantijas par vietnes satura pilnīgumu vai pieejamību. Vietnes izmantošana ir uz jūsu pašu risku.\n\nSaziņa\nJa jums ir jautājumi par šiem lietošanas noteikumiem, lūdzu, sazinieties ar mums pa e-pastu hello@darwinlatvians.org.","heroImage":null,"ctaLabel_en":"","ctaLabel_lv":"","ctaHref":"","metaTitle_en":"Terms & Conditions","metaTitle_lv":"Lietošanas noteikumi","metaDescription_en":"","metaDescription_lv":"","noIndex":false}', '{}',
  NULL, NULL, NULL, 1788447667, 1788447667
) ON CONFLICT(id) DO UPDATE SET
  type_id = excluded.type_id,
  slug = excluded.slug,
  title = excluded.title,
  sort_order = excluded.sort_order,
  data = excluded.data,
  is_published = 1,
  is_current_draft = 1,
  status = 'published',
  published_at = excluded.published_at,
  updated_at = unixepoch();

DELETE FROM documents WHERE type_id = 'pages' AND slug IS NOT NULL AND slug = 'eula' AND is_current_draft = 1 AND id <> 'page-eula';
INSERT INTO documents (
  id, root_id, type_id, type_version, version_of_id, version_number,
  is_current_draft, is_published, status, parent_root_id, slug, path, title, zone,
  sort_order, visible, published_at, scheduled_at, expires_at, deleted_at,
  tenant_id, locale, translation_group_id, data, metadata,
  owner_id, created_by, updated_by, created_at, updated_at
) VALUES (
  'page-eula', 'page-eula', 'pages', 1, NULL, 1,
  1, 1, 'published', '', 'eula', NULL, 'End User License Agreement (EULA)', NULL,
  100, 1, 1788447667, NULL, NULL, NULL,
  'default', 'default', '', '{"slug":"eula","template":"simple","sortOrder":100,"title_en":"End User License Agreement (EULA)","title_lv":"Gala lietotāja licences līgums (EULA)","body_en":"This End User License Agreement (\"Agreement\") is a legal agreement between you and the Latvian Association of Darwin (DLA) for the use of this website and any digital services provided through it.\n\nLicense Grant\nDLA grants you a personal, non-exclusive, non-transferable, revocable license to access and use this website solely for personal, non-commercial purposes in accordance with this Agreement.\n\nRestrictions\nYou agree not to:\n- Modify, decompile, or reverse engineer any part of the website.\n- Use the website to distribute malware, spam, or unlawful content.\n- Scrap or systematically extract data from the website without our permission.\n\nTermination\nThis license is effective until terminated. DLA reserves the right to suspend or terminate your access to the website at any time without notice if you violate this Agreement.\n\nGoverning Law\nThis Agreement is governed by the laws of the Northern Territory, Australia.\n\nContact\nFor any questions regarding this EULA, please contact us at hello@darwinlatvians.org.au","body_lv":"Šis Gala lietotāja licences līgums (\"Līgums\") ir juridisks līgums starp jūsu un Dārvinas Latviešu Apvienību (DLA) par šīs vietnes un ar tās starpniecību sniegto digitālo pakalpojumu izmantošanu.\n\nLicences piešķiršana\nDLA piešķir jums personisku, neekskluzīvu, nenododamu un atsaucamu licenci, lai piekļūtu vietnei un izmantotu to personiskiem, nekomerciāliem mērķiem saskaņā ar šo Līgumu.\n\nIerobežojumi\nJūs piekrītat:\n- Nepārveidot un neveikt vietnes daļu reversās inženierijas procesus.\n- Neizmantot vietni ļaunprogrammatūras, mēstuļu vai nelikumīga satura izplatīšanai.\n- Neveikt automātisku datu ieguvi no vietnes bez mūsu atļaujas.\n\nIzbeigšana\nŠī licence ir spēkā līdz tās izbeigšanai. DLA patur tiesības jebkurā laikā bez brīdinājuma apturēt vai izbeigt jūsu piekļuvi vietnei, ja pārkāpjat šo Līgumu.\n\nPiemērojamie tiesību akti\nŠo Līgumu reglamentē Ziemeļu Teritorijas (Austrālija) tiesību akti.\n\nSaziņa\nJa jums ir jautājumi par šo EULA, lūdzu, sazinieties ar mums pa e-pastu hello@darwinlatvians.org.","heroImage":null,"ctaLabel_en":"","ctaLabel_lv":"","ctaHref":"","metaTitle_en":"End User License Agreement (EULA)","metaTitle_lv":"Gala lietotāja licences līgums (EULA)","metaDescription_en":"","metaDescription_lv":"","noIndex":false}', '{}',
  NULL, NULL, NULL, 1788447667, 1788447667
) ON CONFLICT(id) DO UPDATE SET
  type_id = excluded.type_id,
  slug = excluded.slug,
  title = excluded.title,
  sort_order = excluded.sort_order,
  data = excluded.data,
  is_published = 1,
  is_current_draft = 1,
  status = 'published',
  published_at = excluded.published_at,
  updated_at = unixepoch();

DELETE FROM documents WHERE type_id = 'pages' AND slug IS NOT NULL AND slug = 'home' AND is_current_draft = 1 AND id <> 'page-home';
INSERT INTO documents (
  id, root_id, type_id, type_version, version_of_id, version_number,
  is_current_draft, is_published, status, parent_root_id, slug, path, title, zone,
  sort_order, visible, published_at, scheduled_at, expires_at, deleted_at,
  tenant_id, locale, translation_group_id, data, metadata,
  owner_id, created_by, updated_by, created_at, updated_at
) VALUES (
  'page-home', 'page-home', 'pages', 1, NULL, 1,
  1, 1, 'published', '', 'home', NULL, 'Home', NULL,
  1, 1, 1788447667, NULL, NULL, NULL,
  'default', 'default', '', '{"slug":"home","template":"home","sortOrder":1,"title_en":"Latvian Association of Darwin","title_lv":"Dārvinas Latviešu Apvienība","excerpt_en":"","excerpt_lv":"","body_en":"","body_lv":"","heroImage":"/files/uploads/87a286d39839779b38c5d.webp","ctaLabel_en":"","ctaLabel_lv":"","ctaHref":"","metaTitle_en":"Latvian Association of Darwin | Top End Community","metaTitle_lv":"Dārvinas Latviešu Apvienība | Ziemeļu Teritorijas latvieši","metaDescription_en":"","metaDescription_lv":"","noIndex":false}', '{}',
  NULL, NULL, NULL, 1788447667, 1788447667
) ON CONFLICT(id) DO UPDATE SET
  type_id = excluded.type_id,
  slug = excluded.slug,
  title = excluded.title,
  sort_order = excluded.sort_order,
  data = excluded.data,
  is_published = 1,
  is_current_draft = 1,
  status = 'published',
  published_at = excluded.published_at,
  updated_at = unixepoch();

DELETE FROM documents WHERE type_id = 'pages' AND slug IS NOT NULL AND slug = 'donate' AND is_current_draft = 1 AND id <> 'page-donate';
INSERT INTO documents (
  id, root_id, type_id, type_version, version_of_id, version_number,
  is_current_draft, is_published, status, parent_root_id, slug, path, title, zone,
  sort_order, visible, published_at, scheduled_at, expires_at, deleted_at,
  tenant_id, locale, translation_group_id, data, metadata,
  owner_id, created_by, updated_by, created_at, updated_at
) VALUES (
  'page-donate', 'page-donate', 'pages', 1, NULL, 1,
  1, 1, 'published', '', 'donate', NULL, 'Donate', NULL,
  6, 1, 1788447667, NULL, NULL, NULL,
  'default', 'default', '', '{"slug":"donate","template":"donate","sortOrder":6,"title_en":"Donate","title_lv":"Ziedot","excerpt_en":"","excerpt_lv":"","body_en":"","body_lv":"","heroImage":null,"ctaLabel_en":"","ctaLabel_lv":"","ctaHref":"","metaTitle_en":"Donate | Latvian Association of Darwin","metaTitle_lv":"Ziedot | Dārvinas Latviešu Apvienība","metaDescription_en":"Support the Latvian Association of Darwin","metaDescription_lv":"Atbalstiet Dārvinas Latviešu Apvienību","noIndex":false}', '{}',
  NULL, NULL, NULL, 1788447667, 1788447667
) ON CONFLICT(id) DO UPDATE SET
  type_id = excluded.type_id,
  slug = excluded.slug,
  title = excluded.title,
  sort_order = excluded.sort_order,
  data = excluded.data,
  is_published = 1,
  is_current_draft = 1,
  status = 'published',
  published_at = excluded.published_at,
  updated_at = unixepoch();

DELETE FROM documents WHERE type_id = 'events' AND slug IS NOT NULL AND slug = 'jani-article' AND is_current_draft = 1 AND id <> 'event-jani-article';
INSERT INTO documents (
  id, root_id, type_id, type_version, version_of_id, version_number,
  is_current_draft, is_published, status, parent_root_id, slug, path, title, zone,
  sort_order, visible, published_at, scheduled_at, expires_at, deleted_at,
  tenant_id, locale, translation_group_id, data, metadata,
  owner_id, created_by, updated_by, created_at, updated_at
) VALUES (
  'event-jani-article', 'event-jani-article', 'events', 1, NULL, 1,
  1, 1, 'published', '', 'jani-article', NULL, 'Jaņi - Midsummer magic in the Top End', NULL,
  10, 1, 1788447667, NULL, NULL, NULL,
  'default', 'default', '', '{"slug":"jani-article","title_en":"Jaņi - Midsummer magic in the Top End","title_lv":"Jāņu svinības Dārvinā pulcē latviešu kopienu","eventDate":"2027-06-22T14:30:00.000Z","body_en":"<p>The Darwin Latvian Association (DLA) celebrated Jāņi in a warm atmosphere this year, enjoying traditional food, songs and fellowship. The celebrations began at 5:30 p.m. and we were delighted to welcome Luke Gosling OAM, Federal member for Solomon in the House of Representatives, who briefly joined us for the event. He sampled pīrāgi and Jāņu siers before moving on to attend other community events taking place across Darwin that evening.</p><p><br></p><p>Darwin’s Dry Season is renowned for its great weather, with many of the city’s biggest events taking place on weekends. This year’s Jāņi celebrations coincided with the Supercars race at Hidden Valley Circuit, the India at Mindil Festival at Mindil Beach and the Darwin Chinese Festival at the Waterfront. Although many people were attending other events, DLA members were able to set up tables and chairs at their favourite beachside spot without any rush.</p><p><br></p><p>With the evening’s high tide forecast at 5.98 metres, Craig Smyth built a Midsummer bonfire on the sandbank near the gathering area, carefully choosing a spot so that the waters of Fannie Bay would naturally extinguish it at around 9.53pm.</p><p><br></p><p>At 6.37pm, as the sun was starting to set, Craig lit the Jāņi bonfire. Everyone headed down to the beach, where Jāņi carols were sung and a photo opportunity was taken by the bonfire, with the lights of Darwin City twinkling in the background.</p><p><br></p><p>The celebration then continued at the tables, where guests enjoyed kransky sausages, meatballs, buns with Riga sprats and dill pickles, as well as, of course, pies and Jāņu cheese. The sašliks, prepared according to the SkyDive Latvia recipe, also earned special praise, giving the festive table another authentic Latvian flavor.</p><p><br></p><p>It was a wonderful evening, and this was the largest Jāņi event attended by the Darwin Latvian community in recent years.</p><p><br></p><p>A special mention must go to our guest from Latvia, Dace Cīrule, who had traveled from the other side of the world to spend time with her grandson Marko Moore. Marko, who was only 39 days old, definitely did not want to miss his first Jāņi! As a pleasant surprise, Dace had also brought a special package of Jāņu gotiņas to treat the participants of the celebration.</p><p><br></p><p>DLA thanks everyone who participated and helped make this year''s Jāņi celebrations a truly unforgettable event.</p><p><br></p><p><a href=\"https://laikraksts.com/raksti/14196\" rel=\"noopener noreferrer\" target=\"_blank\">https://laikraksts.com/raksti/14196</a></p><p><br></p><p><br></p><p><br></p>","body_lv":"<p>Dārvinas Latviešu Apvienība (<strong>DLA</strong>) šogad svinēja Jāņus sirsnīgā gaisotnē, baudot tradicionālos ēdienus, dziesmas un kopā būšanu. </p><p>Svinības sākās plkst. 17.30, un mums bija patiess prieks sveikt viesos Austrālijas Federālā parlamenta deputāts Lūks Goslings OAM (Luke Gosling OAM, Federal member for Solomon in the House of Representatives) kurš uz neilgu brīdi pievienojās mūsu pasākumam. </p><p>Viņš nogaršoja tradicionālos pīrāgus un Jāņu sieru, pirms devās tālāk, lai apmeklētu citus kopienas pasākumus, kas tajā vakarā norisinājās visā Dārvinā. Dārvinas sausā sezona (Dry Season) ir slavena ar savu lielisko laiku, tādēļ daudzi no pilsētas lielākajiem pasākumiem tiek rīkoti nedēļas nogalēs. </p><p>Šogad Jāņu svinības sakrita ar Supercars sacensībām Hidden Valley trasē, India@Mindil festivālu Mindil pludmalē un Dārvinas Ķīniešu festivālu Waterfront rajonā. Lai gan daudzi cilvēki apmeklēja citus pasākumus, DLA biedriem bija iespēja bez steigas iekārtot galdus un krēslus iecienītajā piekrastes vietā. </p><p>Tā kā vakara augstākais paisums bija prognozēts 5,98 metru augstumā, Kreigs Smits (Craig Smyth) uz smilšainā sēkļa netālu no pulcēšanās vietas uzbūvēja Jāņu ugunskuru, rūpīgi izvēloties vietu tā, lai Fanijas līča (Fannie Bay) ūdeņi to ap plkst. 21.53 dabiski nodzēstu. Plkst. 18.37, saulei sākot rietēt, Kreigs aizdedzināja Jāņu ugunskuru. </p><p>Visi devās lejup uz pludmali, kur tika dziedātas Jāņu dziesmas un izmantota iespēja nofotografēties pie ugunskura, fonā mirdzot Dārvinas pilsētas gaismām. Pēc tam svinības turpinājās pie galdiem, kur viesi baudīja kransky desiņas, gaļas bumbiņas, smalkmaizītes ar Rīgas šprotēm un diļļu gurķīšiem, kā arī, protams, pīrāgus un Jāņu sieru. Īpašu atzinību izpelnījās arī sašliks, kas tika gatavots pēc SkyDive Latvia receptes, piešķirot svētku galdam vēl vienu autentisku Latvijas garšu. Tas bija brīnišķīgs vakars, un pēdējo gadu laikā šis bija kuplākais Jāņu pasākuma apmeklējums Dārvinas latviešu kopienā.</p><p>Īpaši jāpiemin mūsu viešņa no Latvijas Dace Cīrule, kura bija mērojusi ceļu no pasaules otras malas, lai pavadītu laiku kopā ar savu mazdēlu Marko Mūru (Marko Moore). Tikai 39 dienas vecais Marko noteikti nevēlējās palaist garām savus pirmos Jāņus! Kā patīkamu pārsteigumu Dace bija atvedusi arī īpašu Jāņu gotiņu paciņu, ar ko pacienāt svinību dalībniekus. DLA pateicas visiem, kuri piedalījās un palīdzēja padarīt šī gada Jāņu svinības par patiesi neaizmirstamu notikumu.</p>","image":"/files/uploads/03ffd000d13a76e9839b6.webp","accentTone":"rose","sortOrder":10}', '{}',
  NULL, NULL, NULL, 1788447667, 1788447667
) ON CONFLICT(id) DO UPDATE SET
  type_id = excluded.type_id,
  slug = excluded.slug,
  title = excluded.title,
  sort_order = excluded.sort_order,
  data = excluded.data,
  is_published = 1,
  is_current_draft = 1,
  status = 'published',
  published_at = excluded.published_at,
  updated_at = unixepoch();

DELETE FROM documents WHERE type_id = 'events' AND slug IS NOT NULL AND slug = 'lieldienas' AND is_current_draft = 1 AND id <> 'event-lieldienas';
INSERT INTO documents (
  id, root_id, type_id, type_version, version_of_id, version_number,
  is_current_draft, is_published, status, parent_root_id, slug, path, title, zone,
  sort_order, visible, published_at, scheduled_at, expires_at, deleted_at,
  tenant_id, locale, translation_group_id, data, metadata,
  owner_id, created_by, updated_by, created_at, updated_at
) VALUES (
  'event-lieldienas', 'event-lieldienas', 'events', 1, NULL, 1,
  1, 1, 'published', '', 'lieldienas', NULL, 'Lieldienas – Easter the Latvian Way in Darwin', NULL,
  10, 1, 1788447667, NULL, NULL, NULL,
  'default', 'default', '', '{"slug":"lieldienas","title_en":"Lieldienas – Easter the Latvian Way in Darwin","title_lv":"Lieldienas – Easter the Latvian Way in Darwin","eventDate":"2026-04-05","body_en":"At the Latvian Association of Darwin Inc, we celebrate Lieldienas (Easter) - Latvia''s joyful festival of spring and renewal - with a warm Top End twist. Families and friends gather for natural egg-dyeing, olu ripināšana (egg rolling) olu kaujas (egg-tapping battles), and shared Latvian treats. We embrace ancient customs to welcome the new season, creating a vibrant celebration that blends Latvian heritage with Darwin''s tropical charm. Everyone is welcome to join us as we greet brighter days together.","body_lv":"Dārvinas Latviešu Apvienībā mēs svinam Lieldienas — Latvijas priecīgo pavasara un atjaunošanās svētku — ar siltu Top End pieskārienu. Ģimenes un draugi pulcējas olu dabīgai krāsošanai, olu ripināšanai, olu kaujām un bauda latviešu našķus. Mēs pieņemam senās paražas, lai sagaidītu jauno sezonu, radot dzīvespriecīgu svinēšanu, kas sapludina latviešu mantojumu ar Dārvinas tropisko šarmu. Visi ir laipni aicināti pievienoties mums, sagaidot gaišākas dienas kopā.","image":"/files/uploads/e8ad88045f84514e76360.webp","accentTone":"emerald","sortOrder":10}', '{}',
  NULL, NULL, NULL, 1788447667, 1788447667
) ON CONFLICT(id) DO UPDATE SET
  type_id = excluded.type_id,
  slug = excluded.slug,
  title = excluded.title,
  sort_order = excluded.sort_order,
  data = excluded.data,
  is_published = 1,
  is_current_draft = 1,
  status = 'published',
  published_at = excluded.published_at,
  updated_at = unixepoch();

DELETE FROM documents WHERE type_id = 'events' AND slug IS NOT NULL AND slug = 'may4' AND is_current_draft = 1 AND id <> 'event-may4';
INSERT INTO documents (
  id, root_id, type_id, type_version, version_of_id, version_number,
  is_current_draft, is_published, status, parent_root_id, slug, path, title, zone,
  sort_order, visible, published_at, scheduled_at, expires_at, deleted_at,
  tenant_id, locale, translation_group_id, data, metadata,
  owner_id, created_by, updated_by, created_at, updated_at
) VALUES (
  'event-may4', 'event-may4', 'events', 1, NULL, 1,
  1, 1, 'published', '', 'may4', NULL, '4. maijs - Day of the Restoration of Latvian Independence - Latvijas Republikas Neatkarības atjaunošanas diena', NULL,
  20, 1, 1788447667, NULL, NULL, NULL,
  'default', 'default', '', '{"slug":"may4","title_en":"4. maijs - Day of the Restoration of Latvian Independence - Latvijas Republikas Neatkarības atjaunošanas diena","title_lv":"4. maijs — Latvijas Republikas Neatkarības atjaunošanas diena","eventDate":"2026-05-04","body_en":"On 4 May, we proudly mark Latvia''s Restoration of Independence with the Baltā galdautu svētki—the White Tablecloth Celebration. Our community gathers around a table draped in a white cloth, symbolising peace, unity, and honesty. We share Latvian dishes, reflect on our nation''s journey, and celebrate the resilience and spirit that connect Latvians near and far. In Darwin, this day is a heartfelt reminder of freedom, identity, and the strength of our shared heritage.","body_lv":"4. maijā mēs ar lepnumu atzīmējam Latvijas Neatkarības atjaunošanas dienu, svinot Baltā galdauta svētkus. Mūsu kopiena pulcējas ap baltu galdautu, kas simbolizē mieru, vienotību un godīgumu. Mēs dalāmies latviešu ēdienos, pārdomājam mūsu valsts ceļu un svinam izturību un garu, kas vieno latviešus visā pasaulē. Dārvinā šī diena ir sirsnīgs atgādinājums par brīvību, identitāti un kopīgo mantojumu.","image":"/files/uploads/578246ccd4e099fd5240d.webp","accentTone":"sky","sortOrder":20}', '{}',
  NULL, NULL, NULL, 1788447667, 1788447667
) ON CONFLICT(id) DO UPDATE SET
  type_id = excluded.type_id,
  slug = excluded.slug,
  title = excluded.title,
  sort_order = excluded.sort_order,
  data = excluded.data,
  is_published = 1,
  is_current_draft = 1,
  status = 'published',
  published_at = excluded.published_at,
  updated_at = unixepoch();

DELETE FROM documents WHERE type_id = 'events' AND slug IS NOT NULL AND slug = 'jani' AND is_current_draft = 1 AND id <> 'event-jani';
INSERT INTO documents (
  id, root_id, type_id, type_version, version_of_id, version_number,
  is_current_draft, is_published, status, parent_root_id, slug, path, title, zone,
  sort_order, visible, published_at, scheduled_at, expires_at, deleted_at,
  tenant_id, locale, translation_group_id, data, metadata,
  owner_id, created_by, updated_by, created_at, updated_at
) VALUES (
  'event-jani', 'event-jani', 'events', 1, NULL, 1,
  1, 1, 'published', '', 'jani', NULL, 'Jāņi – Midsummer Magic in the Top End', NULL,
  30, 1, 1788447667, NULL, NULL, NULL,
  'default', 'default', '', '{"slug":"jani","title_en":"Jāņi – Midsummer Magic in the Top End","title_lv":"Jāņi — saulgriežu maģija Top End reģionā","eventDate":"2026-06-23","body_en":"Each June, we bring Latvia''s beloved Jāņi - St John''s Day/Midsummer night —to life beneath Darwin''s star-filled skies. Our community sings traditional Līgo songs, weaves wreaths of leaves and flowers, enjoys hearty Latvian food, and gathers around the Līgo fire to honour the sun''s strength and the promise of good fortune. Music, laughter, and the glow of the bonfire make Jāņi in Darwin a uniquely warm and spirited celebration of culture, nature, and togetherness.","body_lv":"Katru jūniju mēs atdzīvinām Latvijā tik mīļos Jāņus — Līgo vakaru un Jāņu dienu — zem Dārvinas zvaigžņotajām debesīm. Mūsu kopiena dzied tradicionālās Līgo dziesmas, pin vainagus no lapām un ziediem, bauda latviešu ēdienus un pulcējas ap Līgo uguni, godinot saules spēku un labas veiksmes solījumu. Mūzika, smiekli un ugunskura gaisma padara Jāņus Dārvinā par īpaši siltu un dzīvespriecīgu kultūras, dabas un kopības svinēšanu.","image":"/files/uploads/bb490ad46004a170b7d0c.webp","accentTone":"amber","sortOrder":30}', '{}',
  NULL, NULL, NULL, 1788447667, 1788447667
) ON CONFLICT(id) DO UPDATE SET
  type_id = excluded.type_id,
  slug = excluded.slug,
  title = excluded.title,
  sort_order = excluded.sort_order,
  data = excluded.data,
  is_published = 1,
  is_current_draft = 1,
  status = 'published',
  published_at = excluded.published_at,
  updated_at = unixepoch();

DELETE FROM documents WHERE type_id = 'events' AND slug IS NOT NULL AND slug = 'baltijas-cels' AND is_current_draft = 1 AND id <> 'event-baltijas-cels';
INSERT INTO documents (
  id, root_id, type_id, type_version, version_of_id, version_number,
  is_current_draft, is_published, status, parent_root_id, slug, path, title, zone,
  sort_order, visible, published_at, scheduled_at, expires_at, deleted_at,
  tenant_id, locale, translation_group_id, data, metadata,
  owner_id, created_by, updated_by, created_at, updated_at
) VALUES (
  'event-baltijas-cels', 'event-baltijas-cels', 'events', 1, NULL, 1,
  1, 1, 'published', '', 'baltijas-cels', NULL, 'Baltijas ceļš – Commemorating the Baltic Way', NULL,
  40, 1, 1788447667, NULL, NULL, NULL,
  'default', 'default', '', '{"slug":"baltijas-cels","title_en":"Baltijas ceļš – Commemorating the Baltic Way","title_lv":"Baltijas ceļš — Baltijas ceļa piemiņai","eventDate":"2027-08-22T14:30:00.000Z","body_en":"Every August, we join Latvians, Lithuanians, and Estonians worldwide in honouring the Baltijas ceļš—the Baltic Way. Through reflection, shared stories, and a symbolic human chain, we remember the nearly two million people who stood hand-in-hand in 1989 to peacefully demand freedom. Our Darwin commemoration highlights the courage, unity, and hope that shaped our nations'' futures, keeping alive the message that collective strength can inspire profound change.","body_lv":"<p>Katru 23. augustu mēs pievienojamies latviešiem, lietuviešiem un igauņiem visā pasaulē, godinot Baltijas ceļu. Ar pārdomām, kopīgiem stāstiem un simbolisku cilvēku ķēdi mēs pieminam gandrīz divus miljonus cilvēku, kuri 1989. gadā stāvēja plecu pie pleca, lai miermīlīgi pieprasītu brīvību. Mūsu piemiņas pasākums Dārvinā izceļ drosmi, vienotību un cerību, kas veidoja mūsu valstu nākotni, un saglabā vēstījumu, ka kopīga rīcība var radīt lielas pārmaiņas.</p>","image":"/files/uploads/6065e8897f0ccaa67543e.webp","facebookUrl":"https://www.facebook.com/darwinlatvians","accentTone":"rose","sortOrder":40}', '{}',
  NULL, NULL, NULL, 1788447667, 1788447667
) ON CONFLICT(id) DO UPDATE SET
  type_id = excluded.type_id,
  slug = excluded.slug,
  title = excluded.title,
  sort_order = excluded.sort_order,
  data = excluded.data,
  is_published = 1,
  is_current_draft = 1,
  status = 'published',
  published_at = excluded.published_at,
  updated_at = unixepoch();

DELETE FROM documents WHERE type_id = 'events' AND slug IS NOT NULL AND slug = 'nov18' AND is_current_draft = 1 AND id <> 'event-nov18';
INSERT INTO documents (
  id, root_id, type_id, type_version, version_of_id, version_number,
  is_current_draft, is_published, status, parent_root_id, slug, path, title, zone,
  sort_order, visible, published_at, scheduled_at, expires_at, deleted_at,
  tenant_id, locale, translation_group_id, data, metadata,
  owner_id, created_by, updated_by, created_at, updated_at
) VALUES (
  'event-nov18', 'event-nov18', 'events', 1, NULL, 1,
  1, 1, 'published', '', 'nov18', NULL, '18. novembris – Proclamation Day of the Republic of Latvia – Latvia''s Independence Day', NULL,
  50, 1, 1788447667, NULL, NULL, NULL,
  'default', 'default', '', '{"slug":"nov18","title_en":"18. novembris – Proclamation Day of the Republic of Latvia – Latvia''s Independence Day","title_lv":"18. novembris — Latvijas Republikas proklamēšanas diena","eventDate":"2026-11-18","body_en":"On 18 November, we celebrate one of Latvia''s most significant national days—the Proclamation of the Independence of the Republic of Latvia. Our Darwin community gathers to honour this historic moment with speeches, songs, and shared Latvian foods. It is a time to reflect on Latvia''s story, celebrate our identity, and strengthen the bonds that connect Latvians across oceans. Everyone is warmly invited to join us in marking this important day with pride and gratitude.","body_lv":"18. novembrī mēs svinam vienu no nozīmīgākajiem Latvijas valsts svētkiem — Latvijas Republikas proklamēšanas dienu. Dārvinā mēs pulcējamies, lai godinātu šo vēsturisko brīdi ar uzrunām, dziesmām un latviešu ēdieniem. Tas ir laiks pārdomām par Latvijas ceļu, identitātes svinēšanai un saiknes stiprināšanai starp latviešiem visā pasaulē. Visi ir sirsnīgi aicināti pievienoties šiem svētkiem ar lepnumu un pateicību.","image":"/files/uploads/a0bcb2c63cfd55f38ae94.webp","accentTone":"violet","sortOrder":50}', '{}',
  NULL, NULL, NULL, 1788447667, 1788447667
) ON CONFLICT(id) DO UPDATE SET
  type_id = excluded.type_id,
  slug = excluded.slug,
  title = excluded.title,
  sort_order = excluded.sort_order,
  data = excluded.data,
  is_published = 1,
  is_current_draft = 1,
  status = 'published',
  published_at = excluded.published_at,
  updated_at = unixepoch();

DELETE FROM documents WHERE type_id = 'navigation' AND slug IS NOT NULL AND slug = 'main-menu' AND is_current_draft = 1 AND id <> 'nav-main-menu';
INSERT INTO documents (
  id, root_id, type_id, type_version, version_of_id, version_number,
  is_current_draft, is_published, status, parent_root_id, slug, path, title, zone,
  sort_order, visible, published_at, scheduled_at, expires_at, deleted_at,
  tenant_id, locale, translation_group_id, data, metadata,
  owner_id, created_by, updated_by, created_at, updated_at
) VALUES (
  'nav-main-menu', 'nav-main-menu', 'navigation', 1, NULL, 1,
  1, 1, 'published', '', 'main-menu', NULL, 'Main Navigation Menu', NULL,
  0, 1, 1788447667, NULL, NULL, NULL,
  'default', 'default', '', '{"name":"main-menu","items":[{"href":"/history","en":"History","lv":"Vēsture","newTab":false},{"href":"/membership","en":"Join","lv":"Pievienoties","newTab":false},{"href":"/#events","en":"Events","lv":"Pasākumi","newTab":false}]}', '{}',
  NULL, NULL, NULL, 1788447667, 1788447667
) ON CONFLICT(id) DO UPDATE SET
  type_id = excluded.type_id,
  slug = excluded.slug,
  title = excluded.title,
  sort_order = excluded.sort_order,
  data = excluded.data,
  is_published = 1,
  is_current_draft = 1,
  status = 'published',
  published_at = excluded.published_at,
  updated_at = unixepoch();

DELETE FROM documents WHERE type_id = 'footer' AND slug IS NOT NULL AND slug = 'default-footer' AND is_current_draft = 1 AND id <> 'footer-default';
INSERT INTO documents (
  id, root_id, type_id, type_version, version_of_id, version_number,
  is_current_draft, is_published, status, parent_root_id, slug, path, title, zone,
  sort_order, visible, published_at, scheduled_at, expires_at, deleted_at,
  tenant_id, locale, translation_group_id, data, metadata,
  owner_id, created_by, updated_by, created_at, updated_at
) VALUES (
  'footer-default', 'footer-default', 'footer', 1, NULL, 1,
  1, 1, 'published', '', 'default-footer', NULL, 'Site Footer', NULL,
  0, 1, 1788447667, NULL, NULL, NULL,
  'default', 'default', '', '{"name":"default-footer","tagline_en":"Connecting Latvians in the Top End.","tagline_lv":"Vienojot latviešus Ziemeļu Teritorijā.","address_en":"Darwin, Northern Territory, Australia","address_lv":"Dārvina, Ziemeļu Teritorija, Austrālija","rights_en":"All rights reserved.","rights_lv":"Visas tiesības aizsargātas.","items":[{"href":"/about","en":"About","lv":"Par mums","newTab":false},{"href":"/contact","en":"Contacts","lv":"Kontakti","newTab":false},{"href":"/privacy","en":"Privacy Policy","lv":"Privātuma politika","newTab":false},{"href":"/terms","en":"Terms & Conditions","lv":"Lietošanas noteikumi","newTab":false},{"href":"/eula","en":"EULA","lv":"EULA","newTab":false}]}', '{}',
  NULL, NULL, NULL, 1788447667, 1788447667
) ON CONFLICT(id) DO UPDATE SET
  type_id = excluded.type_id,
  slug = excluded.slug,
  title = excluded.title,
  sort_order = excluded.sort_order,
  data = excluded.data,
  is_published = 1,
  is_current_draft = 1,
  status = 'published',
  published_at = excluded.published_at,
  updated_at = unixepoch();

DELETE FROM documents WHERE type_id = 'site_settings' AND slug IS NOT NULL AND slug = 'default-settings' AND is_current_draft = 1 AND id <> 'settings-default';
INSERT INTO documents (
  id, root_id, type_id, type_version, version_of_id, version_number,
  is_current_draft, is_published, status, parent_root_id, slug, path, title, zone,
  sort_order, visible, published_at, scheduled_at, expires_at, deleted_at,
  tenant_id, locale, translation_group_id, data, metadata,
  owner_id, created_by, updated_by, created_at, updated_at
) VALUES (
  'settings-default', 'settings-default', 'site_settings', 1, NULL, 1,
  1, 1, 'published', '', 'default-settings', NULL, 'Site Settings', NULL,
  0, 1, 1788447667, NULL, NULL, NULL,
  'default', 'default', '', '{"key":"default-settings","associationName_en":"Latvian Association of Darwin","associationName_lv":"Dārvinas Latviešu Apvienība","tagline_en":"Dārvinas Latviešu Apvienība","tagline_lv":"Latvian Association of Darwin","contactEmail":"support@latviansofdarwin.org.au","socialLinks":[{"platform":"Facebook","url":"https://www.facebook.com/darwinlatvians"}],"bankName_en":"Bendigo Benk","bankName_lv":"Bendigo Bank","bsb":"633-000","accountNumber":"210814547","accountName_en":"Latvian Association of Darwin","accountName_lv":"Latvian Association of Darwin Inc","payId_en":"Not configured","payId_lv":"Nav konfigurēts","instructions_en":"Enter the verified association bank account and PayID details before accepting donations.","instructions_lv":"Pirms ziedojumu pieņemšanas ievadiet pārbaudītu apvienības bankas kontu un PayID informāciju.","priorityLinks":[{"id":"cultural-events","enTitle":"Cultural Events","enBody":"Funding for continuity of language, heritage, and community celebrations like Jāņi and Lieldienas.","lvTitle":"Kultūras pasākumi","lvBody":"Finansējums valodas, mantojuma un kopienas svētku, piemēram, Jāņu un Lieldienu, nepārtrauktībai.","url":null,"newTab":false},{"id":"community-stability","enTitle":"Community Stability","enBody":"Help with hall rentals, equipment, and resources for our regular gatherings.","lvTitle":"Kopienas stabilitāte","lvBody":"Palīdzība ar telpu īri, aprīkojumu un resursiem mūsu regulārajām tikšanās reizēm.","url":null,"newTab":false},{"id":"emergency-relief","enTitle":"Emergency relief","enBody":"Immediate support for members of our community facing unexpected hardships.","lvTitle":"Ārkārtas palīdzība","lvBody":"Tūlītējs atbalsts mūsu kopienas locekļiem, kuri saskaras ar neparedzētām grūtībām.","url":null,"newTab":false}],"donationOptions":[{"id":"amount-10","amount":10,"enBody":"Helps with transport assistance or a community meal contribution.","lvBody":"Palīdz ar transporta izdevumiem vai kopienas maltītes organizēšanu.","url":"#test01","newTab":true},{"id":"amount-25","amount":25,"enBody":"Covers materials for one cultural workshop or language class.","lvBody":"Nosedz materiālu izmaksas vienai kultūras darbnīcai vai valodas nodarbībai.","url":null,"newTab":true},{"id":"amount-50","amount":50,"enBody":"Supports essential supplies for our major community events.","lvBody":"Atbalsta nepieciešamos krājumus mūsu lielākajiem kopienas pasākumiem.","url":null,"newTab":true},{"id":"amount-100","amount":100,"enBody":"Funds hall hire for a regular community gathering or choir practice.","lvBody":"Finansē telpu īri regulārai kopienas sanāksmei vai kora mēģinājumam.","url":null,"newTab":true},{"id":"amount-250","amount":250,"enBody":"Contributes significantly to our annual national day celebrations.","lvBody":"Ievērojami veicina mūsu ikgadējo nacionālo svētku organizēšanu.","url":null,"newTab":true}],"features":[{"id":"secure-checkout","enLabel":"Secure checkout","lvLabel":"Droši maksājumi"},{"id":"zero-fees","enLabel":"Zero fees via PayID","lvLabel":"Bez komisijas maksas caur PayID"},{"id":"direct-to-community","enLabel":"Direct to community","lvLabel":"Tieši kopienai"}]}', '{}',
  NULL, NULL, NULL, 1788447667, 1788447667
) ON CONFLICT(id) DO UPDATE SET
  type_id = excluded.type_id,
  slug = excluded.slug,
  title = excluded.title,
  sort_order = excluded.sort_order,
  data = excluded.data,
  is_published = 1,
  is_current_draft = 1,
  status = 'published',
  published_at = excluded.published_at,
  updated_at = unixepoch();