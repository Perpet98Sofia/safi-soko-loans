// Lightweight EN/SW translations for the loan flow and dashboards.
export type Lang = "en" | "sw";

export const dict = {
  en: {
    apply_title: "Apply for working capital",
    apply_sub: "Three minutes. Human review on every approval.",
    full_name: "Full name",
    phone: "Phone (M-Pesa)",
    occupation: "What do you do?",
    occ_market_vendor: "Market vendor",
    occ_boda_boda: "Boda boda rider",
    occ_smallholder_farmer: "Smallholder farmer",
    occ_other: "Other",
    region: "Region / county",
    amount: "Amount (KES)",
    purpose: "What is the loan for?",
    period: "Repayment period (months)",
    consent_title: "Consent to data use",
    consent_body:
      "I agree FinSoko may process the information above to assess my creditworthiness. Data is stored within African regions and reviewed by a human officer before any decision.",
    submit: "Submit application",
    submitting: "Submitting…",
    submitted: "Application received — a human officer will review shortly.",
    must_consent: "You must give consent before submitting.",
    dashboard: "My loans",
    status_pending: "Pending",
    status_under_review: "Under human review",
    status_approved: "Approved",
    status_rejected: "Declined",
    lang_label: "Language",
  },
  sw: {
    apply_title: "Omba mkopo wa biashara",
    apply_sub: "Dakika tatu. Kila idhini hupitiwa na ofisa wa kibinadamu.",
    full_name: "Jina kamili",
    phone: "Nambari ya simu (M-Pesa)",
    occupation: "Unafanya kazi gani?",
    occ_market_vendor: "Mfanyabiashara wa soko",
    occ_boda_boda: "Dereva wa boda boda",
    occ_smallholder_farmer: "Mkulima mdogo",
    occ_other: "Nyingine",
    region: "Mkoa / kaunti",
    amount: "Kiasi (KES)",
    purpose: "Mkopo ni wa nini?",
    period: "Muda wa kulipa (miezi)",
    consent_title: "Idhini ya matumizi ya data",
    consent_body:
      "Ninakubali FinSoko itumie taarifa hizi kupima uwezo wangu wa kukopa. Data huhifadhiwa ndani ya kanda za Afrika na hupitiwa na ofisa wa kibinadamu kabla ya uamuzi wowote.",
    submit: "Tuma maombi",
    submitting: "Inatuma…",
    submitted: "Maombi yamepokelewa — ofisa atayapitia hivi karibuni.",
    must_consent: "Lazima utoe idhini kabla ya kutuma.",
    dashboard: "Mikopo yangu",
    status_pending: "Inasubiri",
    status_under_review: "Inakaguliwa",
    status_approved: "Imeidhinishwa",
    status_rejected: "Imekataliwa",
    lang_label: "Lugha",
  },
} as const;

export function t(lang: Lang, key: keyof (typeof dict)["en"]) {
  return dict[lang][key];
}
