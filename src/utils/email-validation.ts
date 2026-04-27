const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const providerDomains: Record<string, string[]> = {
  gmail: ["gmail.com", "googlemail.com"],
  yahoo: ["yahoo.com"],
  hotmail: ["hotmail.com"],
  outlook: ["outlook.com"],
  icloud: ["icloud.com"],
};

export const getEmailFormatError = (email: string) => {
  if (!emailPattern.test(email)) {
    return "Please enter a valid email address";
  }

  const domain = email.split("@")[1]?.toLowerCase();
  const domainName = domain?.split(".")[0];

  if (
    domain &&
    domainName &&
    providerDomains[domainName] &&
    !providerDomains[domainName].includes(domain)
  ) {
    return `Please enter a valid ${domainName} email address`;
  }

  return null;
};
