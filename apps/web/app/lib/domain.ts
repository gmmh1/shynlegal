export type VisaType =
  | "Spouse Visa"
  | "Student Visa"
  | "Skilled Worker Visa"
  | "Visit Visa"
  | "Citizenship"
  | "Other";

export type RiskLevel = "low" | "medium" | "high";

export interface AISummary {
  visa_type: VisaType;
  summary: string;
  risk: RiskLevel;
  missing_info: string[];
  recommendation: "Book consultation" | "Submit enquiry";
}

export interface ServiceCard {
  title: string;
  summary: string;
  detail: string;
}

const riskByVisa: Record<VisaType, RiskLevel> = {
  "Spouse Visa": "medium",
  "Student Visa": "low",
  "Skilled Worker Visa": "medium",
  "Visit Visa": "medium",
  Citizenship: "low",
  Other: "high",
};

const missingByVisa: Record<VisaType, string[]> = {
  "Spouse Visa": ["Income threshold evidence", "Relationship proof timeline"],
  "Student Visa": ["CAS reference", "Tuition and maintenance funds"],
  "Skilled Worker Visa": [
    "Certificate of Sponsorship",
    "Role salary threshold",
  ],
  "Visit Visa": ["Purpose of visit documents", "Return intent evidence"],
  Citizenship: ["Residency timeline", "Life in the UK test status"],
  Other: ["Route eligibility", "Required supporting evidence"],
};

export const services = [
  "Family Visas",
  "Student Visa",
  "Visit Visa",
  "Skilled Worker Visa",
  "Naturalisation & Citizenship",
  "EU Settlement Scheme",
  "Ancestry Visa",
  "E-Visa Transition",
  "Other Immigration Routes",
];

export const serviceCards: ServiceCard[] = [
  {
    title: "Spouse, fiance, and unmarried partner visas",
    summary:
      "Compassionate and professional guidance for families reuniting in the UK.",
    detail:
      "We prepare relationship evidence, financial documents, and route-specific submissions so your application is ready to meet UKVI standards.",
  },
  {
    title: "Student visas",
    summary: "End-to-end support for applicants planning to study in the UK.",
    detail:
      "From CAS checks to maintenance evidence and document sequencing, we reduce avoidable refusals through structured preparation.",
  },
  {
    title: "Skilled worker and health & care worker visas",
    summary: "Practical support for professionals and sponsored routes.",
    detail:
      "We review sponsorship evidence, salary threshold compliance, and timeline planning to keep applications accurate and submission-ready.",
  },
  {
    title: "Visit visas",
    summary: "Clear strategy for short-stay travel and family visit purposes.",
    detail:
      "Our team helps present purpose, ties, and financial evidence in a concise narrative that aligns with immigration rules.",
  },
  {
    title: "Naturalisation and citizenship",
    summary: "Guidance for settlement progression and citizenship outcomes.",
    detail:
      "We assess residency history, eligibility milestones, and evidence quality to support confident naturalisation submissions.",
  },
  {
    title: "Ancestry, EEA, e-visa and other complex routes",
    summary:
      "Detailed advisory support where route-specific interpretation matters.",
    detail:
      "We provide tailored case strategy for ancestry applications, EEA-related matters, e-visa transitions, and nuanced immigration scenarios.",
  },
];

export const reviews = [
  {
    source: "Google",
    rating: 5,
    author: "Hannan Khan",
    content:
      "I have had an incredible experience. All my paperwork was done perfectly and my husband had got his spouse visa approved. We were extremely satisfied and I would recommend sir Reza Rehaman to everyone! He has managed to do everything upto the top standard and ensured everything was prefect before sending this off. 10/10",
  },
  {
    source: "Google",
    rating: 5,
    author: "Maz Ahmed",
    content:
      "I have been using his services never had any issue. Best person to call when you need — plus he's honest and trustworthy. I will recommend everyone to use him. He is the best at what he do. I've used Reza's services for my wife's spouse visa application. Thanks Reza.",
  },
  {
    source: "Google",
    rating: 5,
    author: "Marisa Jimenez",
    content:
      "Reza Rahman from SHYN Legal assisted me with my husband's spouse visa, from a time I thought this would never be possible to now been joined together. Reza made things smooth, answered loads of questions, and put everything in great perspective. When it was time to submit, he made it so easy. I had no doubt that we would be granted the visa. This was an amazing service. Thank you ever so much Reza — I could not be more grateful.",
  },
  {
    source: "Google",
    rating: 5,
    author: "Abul Hasnath",
    content:
      "My brother in law and I sought help from Reza regarding my sister's spouse visa application from Bangladesh. The services received were thorough and professional. We were explained the process clearly and given a written list of documents. My sister got her visa through adequate maintenance route without fulfilling the financial requirements. I'd highly recommend Reza to anyone and we will return for my sister's visa extension.",
  },
  {
    source: "Google",
    rating: 5,
    author: "Catalina Gabriela",
    content:
      "Highly recommend SHYN Legal for UK partner visa applications! Professional, knowledgeable, and incredibly supportive throughout the process. Thanks to their guidance, our application was successful. Excellent service! Deserve more than 5 stars!",
  },
  {
    source: "Google",
    rating: 5,
    author: "Tracy Hope",
    content:
      "A year ago my husband and I received a very professional, caring, and friendly service from Reza during my husband's first UK Spouse visa application. His expertise and knowledge of this area was second to none. Without his help and advice, I doubt we would have been able to complete our application ourselves. I would recommend SHYN Legal 110% every time. Worth every penny — without it my husband and I wouldn't be together in the UK as a family now. THANK YOU SO MUCH.",
  },
  {
    source: "Google",
    rating: 5,
    author: "CRYP TIPS",
    content:
      "Me and my wife have been daunted by the thought of doing our UK Spouse Visa for some time, Philippines to UK. 'Reza Rahman' handled our case and boy oh boy was it worth it. Reza gives a simple breakdown of what we need to add or remove and does so very swiftly, all whilst being there at any time to answer our many questions. Thank you to SHYN Legal and a personal thank you to Reza Rahman. Our visa was accepted after 5 weeks of waiting.",
  },
  {
    source: "Google",
    rating: 5,
    author: "Ahlam Hamdan",
    content:
      "Reza Rahman is exceptional, not only in character and professionalism but in thorough detailed knowledge around immigration matters! Personally I was helped with a spouse visa. A list of documents was personalised to my situation. I received a successful decision and visa in 25 working days. If you really want things done right the first time round — it's Reza!! Thank you for uniting my family.",
  },
  {
    source: "Google",
    rating: 5,
    author: "Anum Durrani",
    content:
      "I opted for Reza's services for my husband's case which was a very tricky one — he had three rejections in the past. The way Reza handled his case is amazing. He managed to brief me about all the documents and nuances and thoroughly checked everything. He is a seasoned lawyer who is well aware of all the processes and laws. Our prayers and efforts of Reza were materialised — my husband got his visa within ten days. Words will not suffice for what you have done for us. Thank you so much, may Allah bless you always.",
  },
  {
    source: "Facebook",
    rating: 5,
    author: "Mohammed Siddeek",
    content:
      "I cannot express my gratitude to SHYN Legal especially Mr. Reza, who was instrumental in giving us the necessary legal advice and following up with the documents. I would highly recommend anyone who requires spouse visas or any other services to get in touch with SHYN before wasting your hard earned money elsewhere — the charges are very minimum compared to most firms out there. Thank you once again.",
  },
  {
    source: "Google",
    rating: 5,
    author: "Meriem Adil",
    content:
      "Excellent service! Mr Rezaur Rahman was incredibly helpful throughout the entire visa application process. He answered all my questions with patience and clarity, making everything much easier. Thanks to his guidance, my husband's visa was approved smoothly. Highly recommend.",
  },
  {
    source: "Google",
    rating: 5,
    author: "Dochiu Vasilica",
    content:
      "We used the services of SHYN Legal to obtain our fiancé visa, which has been approved! We would like to express our sincere gratitude to Reza Rahman for his exceptional support throughout the entire process. His professionalism, patience, and dedication made everything so much easier. His fees are very reasonable. Mr Reza is an incredibly knowledgeable solicitor and we will definitely be working with him again. You're in great hands with Mr Reza.",
  },
  {
    source: "Google",
    rating: 5,
    author: "Samantha Fletcher",
    content:
      "I used the knowledge and services provided by Mr. Rahman. The visa process can be extremely overwhelming but Mr. Rahman provided clear and to the point information at every stage. I remember thinking 'I don't want to get this wrong'. With the support and guidance from Mr. Rahman my husband's visa was successful. I will 100% be using his services again to arrange my step son's visa.",
  },
  {
    source: "Facebook",
    rating: 5,
    author: "Mur Ble",
    content:
      "I met Reza Rahman through online pages and simply asked one question. Reza gave me so much information without even knowing him. He was so helpful, finished my application and it was very successful. We were very happy with the service provided by Mr Reza Rahman. He is always available whenever we need him — always answers messages or phone calls at any time. Very recommended.",
  },
  {
    source: "Google",
    rating: 5,
    author: "Anonymous",
    content:
      "I am immensely grateful for the exceptional support provided by SHYN Legal (Mr. Reza) throughout my UK visa application process. Their professionalism, expertise, and meticulous attention to detail were instrumental in ensuring a smooth and successful experience. Their dedication extended beyond mere procedural assistance — they took a genuine interest in my personal objectives and tailored their advice to my specific goals. Thanks to their unwavering support, I am now in the UK pursuing my academic and professional aspirations. I wholeheartedly recommend their services.",
  },
  {
    source: "Google",
    rating: 5,
    author: "Khan Manna",
    content:
      "It is a pleasure to share my recent experience with SHYN Legal. I met with Mr. Reza to sort out one of my immigration related issues. I was surprised by Mr. Reza's excellent skill and knowledge — his professionalism got me my desired results within a week. A massive salutation from myself to Mr. Reza for his friendly attitude. Many thanks. I wish SHYN Legal and Mr. Reza all the best.",
  },
  {
    source: "Google",
    rating: 5,
    author: "Khaled Alwajih",
    content:
      "I am so happy to share my experience with Reza Rahman. A professional immigration lawyer who is cooperative, patient, and well versed. Reza assessed my family visa case, answered all my questions and concerns, and got me the family visa with ease. I recommend him to everyone who wants to apply for a family visa UK. May God bless brother Reza and his family.",
  },
  {
    source: "Google",
    rating: 5,
    author: "Junaid Ahmed",
    content:
      "The most helpful lawyer I've ever met. Gives the most precise and direct advice — never felt the urgency for money from them while doing my case. I've recommended many of my friends and they all were very satisfied with the service. Definitely recommend. I'm an ongoing client. Thanks for all your help.",
  },
  {
    source: "Google",
    rating: 5,
    author: "Nikol Petrova",
    content:
      "Great experience! Very professional and efficient! Really helpful — would highly recommend!",
  },
  {
    source: "Facebook",
    rating: 5,
    author: "Ali Djeninat",
    content:
      "I can't thank him enough for the very professional work he did for me to bring my wife. Highly recommended — Mr Reza Rahman.",
  },
  {
    source: "Google",
    rating: 5,
    author: "Sasha Mix",
    content:
      "Helped massively with our visa application! I wouldn't recommend anyone else! He picked up on minor errors that I would have missed. He knows his stuff! 5 star guy!!",
  },
  {
    source: "Google",
    rating: 5,
    author: "Khairul Islam",
    content:
      "Had my wife's British citizenship and indefinite leave — both applications were done very successfully by this firm. Would recommend them very highly.",
  },
  {
    source: "Facebook",
    rating: 5,
    author: "Alexander Rez",
    content:
      "I write my feedback to say a very big thank you to my solicitor and the company for the big help getting my wife her pre-settled status. After hard and honest work I recommend them to anyone who has trouble with visa or other things. They have been very clear and honest.",
  },
  {
    source: "Google",
    rating: 5,
    author: "Chinedu Steven",
    content:
      "We applied for a spouse visa to the UK through solicitor Reza and everything went successfully. Our visa processing only took one month from the day of biometric. I will recommend Reza to anyone who wants their application handled properly and successfully. Reza is an honest man.",
  },
  {
    source: "Google",
    rating: 5,
    author: "Wadduha Khan",
    content:
      "I applied for my mum's visit visa for the first time with the help of Reza and was so pleased when it was accepted. Will definitely recommend him.",
  },
  {
    source: "Facebook",
    rating: 5,
    author: "Moynul Islam",
    content:
      "SHYN Legal is a very professional legal service. I always take services from SHYN Legal for any of my immigration problems because they help me solve my problems with care and professionalism and the fees are also affordable. If you have any immigration problem or need legal assistance I would recommend you to take services from SHYN Legal.",
  },
  {
    source: "Google",
    rating: 5,
    author: "Stuart Shanks",
    content:
      "Reza was amazing. Helped me with getting my wife's visa to the UK. I would highly recommend using his services as he is very knowledgeable about the UK immigration system.",
  },
];

export function buildSummary(visaType: VisaType, details: string): AISummary {
  const trimmed = details.trim();
  const summary =
    trimmed.length > 170 ? `${trimmed.slice(0, 167)}...` : trimmed;

  return {
    visa_type: visaType,
    summary: summary || "Initial eligibility details captured.",
    risk: riskByVisa[visaType],
    missing_info: missingByVisa[visaType],
    recommendation:
      visaType === "Other" ? "Submit enquiry" : "Book consultation",
  };
}
