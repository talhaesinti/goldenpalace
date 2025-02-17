import React from "react";
import ContactDetailClient from './ContactDetailClient';

async function getContactData() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/banners?type=contact&is_active=true`, {
      next: { revalidate: 86400 } 
    });

    if (!response.ok) {
      return {
        data: null,
        error: "Sunucu yanıt vermedi. Lütfen daha sonra tekrar deneyin."
      };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error: "Beklenmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin."
    };
  }
}

async function ContactPage() {
  const { data: contactData, error } = await getContactData();

  return (
    <ContactDetailClient 
      initialData={contactData}
      error={error}
    />
  );
}

export default ContactPage;
