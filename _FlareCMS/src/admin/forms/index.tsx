import type { ComponentType } from "react";
import type { PostTemplate } from "../../contentTypes";

import type { EditorFormProps } from "./fields";
import { ContentPageForm } from "./ContentPageForm";
import { SimplePageForm } from "./SimplePageForm";
import { HomeForm } from "./HomeForm";
import { EventForm } from "./EventForm";
import { NavigationForm } from "./NavigationForm";
import { FooterForm } from "./FooterForm";
import { SiteForm } from "./SiteForm";
import { DonateForm } from "./DonateForm";

export const templateForms: Record<PostTemplate, ComponentType<EditorFormProps>> = {
  content: ContentPageForm,
  simple: SimplePageForm,
  home: HomeForm,
  event: EventForm,
  navigation: NavigationForm,
  footer: FooterForm,
  site: SiteForm,
  donate: DonateForm,
};
