export type TokenProfileData = {
  birthday: string;
  city: string;
  complement: string;
  age: string;
  createdAt: string;
  email: string;
  identityDocument: string;
  name: string;
  neighborhood: string;
  number: string;
  phone: string;
  socialDocument: string;
  state: string;
  status: string;
  street: string;
  zipCode: string;
};

export const defaultProfileData: TokenProfileData = {
  birthday: "Nao informado",
  city: "Nao informado",
  complement: "Nao informado",
  age: "Not available",
  createdAt: "Not available",
  email: "Not available",
  identityDocument: "Nao informado",
  name: "Not available",
  neighborhood: "Nao informado",
  number: "Nao informado",
  phone: "(XX) XXXXX-XXXX",
  socialDocument: "Nao informado",
  state: "Nao informado",
  status: "Nao informado",
  street: "Nao informado",
  zipCode: "Nao informado",
};

function getAgeFromBirthday(birthday: string | null) {
  if (!birthday) {
    return defaultProfileData.age;
  }

  const birthDate = new Date(birthday);

  if (Number.isNaN(birthDate.getTime())) {
    return defaultProfileData.age;
  }

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const hasNotHadBirthdayThisYear =
    today.getMonth() < birthDate.getMonth() ||
    (
      today.getMonth() === birthDate.getMonth() &&
      today.getDate() < birthDate.getDate()
    );

  if (hasNotHadBirthdayThisYear) {
    age -= 1;
  }

  return String(age);
}

function decodeTokenPayload(token: string) {
  try {
    const [, payload] = token.split(".");

    if (!payload) {
      return null;
    }

    const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
    const paddedPayload = normalizedPayload.padEnd(
      normalizedPayload.length + ((4 - (normalizedPayload.length % 4)) % 4),
      "=",
    );
    const decodedPayload = window.atob(paddedPayload);

    return JSON.parse(decodedPayload) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function formatDate(dateValue: string | null, fallback: string) {
  if (!dateValue) {
    return fallback;
  }

  const parsedDate = new Date(dateValue);

  if (Number.isNaN(parsedDate.getTime())) {
    return fallback;
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(parsedDate);
}

export function getProfileDataFromToken(token: string | null): TokenProfileData {
  if (!token) {
    return defaultProfileData;
  }

  const payload = decodeTokenPayload(token);

  if (!payload) {
    return defaultProfileData;
  }

  const name =
    (typeof payload.name === "string" && payload.name.trim() ? payload.name : "") ||
    (typeof payload.username === "string" ? payload.username : "") ||
    defaultProfileData.name;
  const birthday =
    typeof payload.birthday === "string" ? payload.birthday : null;
  const formattedBirthday = formatDate(birthday, defaultProfileData.birthday);
  const email =
    typeof payload.email === "string" ? payload.email : defaultProfileData.email;
  const createdAtValue =
    typeof payload.createdAt === "string" ? payload.createdAt : null;
  const createdAt = formatDate(createdAtValue, defaultProfileData.createdAt);
  const phone =
    typeof payload.phone === "string" && payload.phone.trim()
      ? payload.phone
      : defaultProfileData.phone;
  const status =
    typeof payload.status === "string" && payload.status.trim()
      ? payload.status
      : defaultProfileData.status;
  const identityDocument =
    typeof payload.identityDocument === "string" && payload.identityDocument.trim()
      ? payload.identityDocument
      : defaultProfileData.identityDocument;
  const socialDocument =
    typeof payload.socialDocument === "string" && payload.socialDocument.trim()
      ? payload.socialDocument
      : defaultProfileData.socialDocument;
  const street =
    typeof payload.street === "string" && payload.street.trim()
      ? payload.street
      : defaultProfileData.street;
  const number =
    typeof payload.number === "string" && payload.number.trim()
      ? payload.number
      : typeof payload.number === "number"
        ? String(payload.number)
        : defaultProfileData.number;
  const complement =
    typeof payload.complement === "string" && payload.complement.trim()
      ? payload.complement
      : defaultProfileData.complement;
  const neighborhood =
    typeof payload.neighborhood === "string" && payload.neighborhood.trim()
      ? payload.neighborhood
      : defaultProfileData.neighborhood;
  const city =
    typeof payload.city === "string" && payload.city.trim()
      ? payload.city
      : defaultProfileData.city;
  const state =
    typeof payload.state === "string" && payload.state.trim()
      ? payload.state
      : defaultProfileData.state;
  const zipCode =
    typeof payload.zipCode === "string" && payload.zipCode.trim()
      ? payload.zipCode
      : defaultProfileData.zipCode;

  return {
    birthday: formattedBirthday,
    city,
    complement,
    age: getAgeFromBirthday(birthday),
    createdAt,
    email,
    identityDocument,
    name,
    neighborhood,
    number,
    phone,
    socialDocument,
    state,
    status,
    street,
    zipCode,
  };
}
