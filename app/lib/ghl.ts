const GHL_API_URL = "https://services.leadconnectorhq.com";

export interface CreateGHLContactDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  source?: string;
  locationId: string;
}

export interface GHLContactResponse {
  contact?: {
    id: string;
    email?: string;
    phone?: string;
  };
  message?: string;
  errors?: Array<{ message: string }>;
}

export async function createContact(
  contactData: CreateGHLContactDto
): Promise<GHLContactResponse | null> {
  const authorization =
    process.env.GHL_AUTHORIZATION_TOKEN ||
    "pit-281b7e04-cea1-4242-991e-bb3210aeab6e";

  try {
    const payload: Record<string, string> = {
      locationId: contactData.locationId,
    };

    if (contactData.email) payload.email = contactData.email;
    if (contactData.phone) payload.phone = contactData.phone;
    if (contactData.source) payload.source = contactData.source;

    const response = await fetch(`${GHL_API_URL}/contacts/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authorization}`,
        "Content-Type": "application/json",
        Version: "2021-07-28",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = (await response.json().catch(() => null)) as GHLContactResponse | null;
      const errorMessage =
        errorData?.message?.toLowerCase() ||
        errorData?.errors?.[0]?.message?.toLowerCase() ||
        "";

      // Silently ignore duplicate contact errors
      if (
        (response.status === 400 || response.status === 422) &&
        (errorMessage.includes("duplicate") ||
          errorMessage.includes("already exists") ||
          errorMessage.includes("contact already"))
      ) {
        console.log("GHL: Duplicate contact detected, ignoring...");
        return null;
      }

      console.error("GHL Service Error:", {
        status: response.status,
        data: errorData,
      });
      return null;
    }

    const data = (await response.json()) as GHLContactResponse;
    console.log("GHL: Contact created successfully", {
      contactId: data.contact?.id,
    });
    return data;
  } catch (error) {
    console.error("GHL: Unexpected error in contact creation", error);
    return null;
  }
}
