import { OrganizationType } from "../../models/admin/organization/organization";

export interface SeedOrganizationPayload {
  name: string;
  organizationType: OrganizationType;
  email: string;
  phone?: string;
  country: string;
  city: string;
  timezone: string;
  address: string;
  venueTemplateName: string;
  isActive?: boolean;
}


