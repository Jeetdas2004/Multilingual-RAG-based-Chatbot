import collegesSummary from '@/data/colleges/colleges_summary.json';
import generalRajasthanDte from '@/data/colleges/general_rajasthan_dte.json';
import gpcajmer from '@/data/colleges/gpcajmer.json';
import gpcalwar from '@/data/colleges/gpcalwar.json';
import gpcbanswara from '@/data/colleges/gpcbanswara.json';
import gpcbaran from '@/data/colleges/gpcbaran.json';
import gpcbarmer from '@/data/colleges/gpcbarmer.json';
import gpcbharatpur from '@/data/colleges/gpcbharatpur.json';
import gpcbhilwara from '@/data/colleges/gpcbhilwara.json';
import gpcbikaner from '@/data/colleges/gpcbikaner.json';
import gpcbundi from '@/data/colleges/gpcbundi.json';
import gpcchittorgarh from '@/data/colleges/gpcchittorgarh.json';
import gpcjaipur from '@/data/colleges/gpcjaipur.json';
import gpcjodhpur from '@/data/colleges/gpcjodhpur.json';
import gpckota from '@/data/colleges/gpckota.json';

export const COLLEGES_DB: Record<string, any> = {
  gpcajmer,
  gpcalwar,
  gpcbanswara,
  gpcbaran,
  gpcbarmer,
  gpcbharatpur,
  gpcbhilwara,
  gpcbikaner,
  gpcbundi,
  gpcchittorgarh,
  gpcjaipur,
  gpcjodhpur,
  gpckota,
  general_rajasthan_dte: generalRajasthanDte,
};

export const COLLEGES_META = [
  { name: "Government Polytechnic College, Ajmer", minScore: 82, value: "gpcajmer", city: "Ajmer" },
  { name: "Government Polytechnic College, Alwar", minScore: 78, value: "gpcalwar", city: "Alwar" },
  { name: "Government Polytechnic College, Jaipur", minScore: 86, value: "gpcjaipur", city: "Jaipur" },
  { name: "Government Polytechnic College, Jodhpur", minScore: 81, value: "gpcjodhpur", city: "Jodhpur" },
  { name: "Government Polytechnic College, Kota", minScore: 80, value: "gpckota", city: "Kota" },
  { name: "Government Polytechnic College, Bikaner", minScore: 79, value: "gpcbikaner", city: "Bikaner" },
  { name: "Government Polytechnic College, Banswara", minScore: 73, value: "gpcbanswara", city: "Banswara" },
  { name: "Government Polytechnic College, Baran", minScore: 74, value: "gpcbaran", city: "Baran" },
  { name: "Government Polytechnic College, Barmer", minScore: 70, value: "gpcbarmer", city: "Barmer" },
  { name: "Government Polytechnic College, Bharatpur", minScore: 72, value: "gpcbharatpur", city: "Bharatpur" },
  { name: "Government Polytechnic College, Bhilwara", minScore: 74, value: "gpcbhilwara", city: "Bhilwara" },
  { name: "Government Polytechnic College, Bundi", minScore: 75, value: "gpcbundi", city: "Bundi" },
  { name: "Government Polytechnic College, Chittorgarh", minScore: 72, value: "gpcchittorgarh", city: "Chittorgarh" },
  { name: "DTE Rajasthan (General Inquiries)", minScore: 60, value: "general_rajasthan_dte", city: "Statewide" }
];

export const NEWS_ITEMS = [
  {
    id: 1,
    title: "DTE Rajasthan Polytechnic Admissions 2026 Announced",
    description: "Department of Technical Education opens online registration for 1st Year Diploma and Lateral Entry 2nd Year courses on hte.rajasthan.gov.in.",
    category: "Admissions",
    date: "November 2026"
  },
  {
    id: 2,
    title: "100% Tuition Fee Exemption for Female Students in Govt Colleges",
    description: "Rajasthan Government reinforces zero tuition fee policy for all female candidates admitted to government polytechnic and technical institutes.",
    category: "Scholarships",
    date: "2026-27"
  },
  {
    id: 3,
    title: "Post-Matric Scholarship Applications Open on SJED Portal",
    description: "SC, ST, OBC (BPL), and EWS students can submit applications for complete tuition fee reimbursement through the SSO scholarship portal.",
    category: "Financial Aid",
    date: "Active"
  },
  {
    id: 4,
    title: "New Renewable Energy & Solar Tech Labs Inaugurated at GPC Bikaner",
    description: "Advanced solar simulation and testing laboratories commissioned to train diploma students for Rajasthan's expanding clean energy sector.",
    category: "Infrastructure",
    date: "Recent"
  },
  {
    id: 5,
    title: "Campus Placement Drive: Top Automotive and Core Giants Visit GPC Campuses",
    description: "Tata Motors, L&T, Maruti Suzuki, and Havells recruit over 450 diploma engineers with packages ranging up to ₹5.50 LPA.",
    category: "Placements",
    date: "Campus Update"
  }
];

export function predictColleges(score: number, category: string = "General") {
  const cat = (category || "General").toUpperCase();
  let relaxation = 0.0;
  if (cat.includes("OBC")) relaxation = 3.0;
  else if (cat.includes("SC") || cat.includes("ST")) relaxation = 8.0;
  else if (cat.includes("EWS")) relaxation = 2.0;

  const adjustedScore = score + relaxation;

  const predictions = COLLEGES_META
    .filter(c => c.value !== "general_rajasthan_dte")
    .map(college => {
      const minCutoff = college.minScore;
      let chance = "Low";
      if (adjustedScore >= minCutoff + 3) chance = "High";
      else if (adjustedScore >= minCutoff - 3) chance = "Moderate";
      else if (adjustedScore >= minCutoff - 7) chance = "Competitive";
      else chance = "Reach";

      return {
        name: college.name,
        city: college.city,
        value: college.value,
        minScore: minCutoff,
        studentScore: score,
        chance,
        eligible: adjustedScore >= (minCutoff - 3)
      };
    })
    .sort((a, b) => {
      if (a.eligible && !b.eligible) return -1;
      if (!a.eligible && b.eligible) return 1;
      return a.minScore - b.minScore;
    });

  return {
    student_score: score,
    category,
    recommended_colleges: predictions.slice(0, 6)
  };
}

export function jsonToChunks(data: any): string[] {
  if (!data) return [];
  const chunks: string[] = [];
  const collegeName = data.name || "Polytechnic College";
  const city = data.city || "Rajasthan";

  // 1. Overview
  if (data.overview || data.established) {
    chunks.push(`${collegeName} (${city}, Rajasthan). Established: ${data.established || 'N/A'}. Affiliated to: ${data.affiliated_to || 'BTER Jodhpur'}. Overview: ${data.overview || ''}`);
  }

  // 2. Branches
  if (data.branches && Array.isArray(data.branches)) {
    const branchLines = data.branches.map((b: any) =>
      `- ${b.branch}: Intake ${b.intake || 60} seats, Duration: ${b.duration || '3 Years'}, Cutoff: ~${b.min_cutoff_percent || 70}%`
    );
    chunks.push(`Courses and Branches offered at ${collegeName}:\n` + branchLines.join('\n'));
  }

  // 3. Admission Process
  if (data.admission_process || data.eligibility) {
    chunks.push(`Admission Process and Eligibility for ${collegeName}:\nProcess: ${data.admission_process || ''}\nEligibility: ${data.eligibility || ''}`);
  }

  // 4. Fee Structure
  if (data.fee_structure) {
    const feeLines = [`Fee Structure for ${collegeName}:`];
    for (const [k, v] of Object.entries(data.fee_structure)) {
      feeLines.push(`- ${k.replace(/_/g, ' ').toUpperCase()}: ${v}`);
    }
    chunks.push(feeLines.join('\n'));
  }

  // 5. Scholarships
  if (data.scholarships && Array.isArray(data.scholarships)) {
    chunks.push(`Scholarships available at ${collegeName} (Government of Rajasthan Schemes):\n` + data.scholarships.map((s: string) => `- ${s}`).join('\n'));
  }

  // 6. Hostel & Facilities
  if (data.hostel_facilities || data.campus_facilities) {
    chunks.push(`Hostel and Campus Facilities at ${collegeName}:\nHostels: ${data.hostel_facilities || 'Available'}\nCampus: ${data.campus_facilities || 'Standard'}`);
  }

  // 7. Placements
  if (data.placements) {
    chunks.push(`Placements and Recruiters at ${collegeName}:\n- Average Package: ${data.placements.average_package || 'N/A'}\n- Highest Package: ${data.placements.highest_package || 'N/A'}\n- Placement Rate: ${data.placements.placement_rate || 'N/A'}\n- Top Recruiters: ${(data.placements.top_recruiters || []).join(', ')}`);
  }

  // 8. Contact
  if (data.contact) {
    chunks.push(`Contact Information for ${collegeName}:\n- Address: ${data.contact.address || 'N/A'}\n- Phone: ${data.contact.phone || 'N/A'}\n- Email: ${data.contact.email || 'N/A'}\n- Helpline: ${data.contact.helpline || '1800-180-6127'}\n- Website: ${data.website || 'https://hte.rajasthan.gov.in'}`);
  }

  return chunks;
}

export function synthesizeNativeResponse(query: string, collegeName: string, chunks: string[], lang: string): string {
  const queryLower = query.toLowerCase();
  const isHindi = lang && (lang.toLowerCase() === "hindi" || lang.toLowerCase() === "hi" || lang.includes("हिन्द"));
  const collegeDisplay = collegeName.startsWith("gpc") ? collegeName.replace("gpc", "GPC ").toUpperCase() : collegeName;

  const isFee = /fee|cost|charge|paisa|rupee|fees|फीस|शुल्क/i.test(queryLower);
  const isAdm = /admiss|eligib|apply|form|date|प्रवेश|दाखिला|योग्यता/i.test(queryLower);
  const isHostel = /hostel|room|mess|food|रहना|हॉस्टल|छात्रावास/i.test(queryLower);
  const isPlace = /placement|job|salary|package|company|recruit|नौकरी|प्लेसमेंट/i.test(queryLower);
  const isBranch = /branch|course|stream|cse|civil|mechanical|electrical|सीटें|ब्रांच|कोर्स/i.test(queryLower);
  const isScholarship = /scholarship|chhatravriti|concession|waiver|छात्रवृत्ति/i.test(queryLower);
  const isContact = /contact|phone|email|address|helpline|संपर्क|फोन/i.test(queryLower);

  if (isHindi) {
    if (isFee) {
      return `### 🏛️ ${collegeDisplay} — फीस संरचना (प्रज्ञा AI)\n\n` +
        `**💰 फीस संरचना (Fee Structure):**\n` +
        `- **सरकारी सहायता प्राप्त सीट (GAS):** लगभग **₹7,200 प्रति वर्ष**\n` +
        `- **स्व-वित्तपोषित सीट (SFS):** लगभग **₹21,000 प्रति वर्ष**\n` +
        `- **कॉशन मनी:** ₹1,000 (वापसी योग्य/Refundable)\n` +
        `- **फीस माफी:** राजस्थान सरकार के नियमानुसार **सभी छात्राओं (Girls) और SC/ST वर्ग के छात्रों के लिए सरकारी सीटों पर ट्यूशन फीस 100% पूरी तरह माफ** है।`;
    }
    if (isAdm) {
      return `### 🏛️ ${collegeDisplay} — प्रवेश प्रक्रिया (प्रज्ञा AI)\n\n` +
        `**📝 प्रवेश प्रक्रिया एवं योग्यता (Admission & Eligibility):**\n` +
        `- **योग्यता:** 10वीं कक्षा में विज्ञान और गणित विषयों के साथ न्यूनतम **35% अंक** अनिवार्य हैं।\n` +
        `- **प्रक्रिया:** तकनीकी शिक्षा निदेशालय (DTE राजस्थान) के केंद्रीकृत काउंसलिंग पोर्टल ([hte.rajasthan.gov.in](https://hte.rajasthan.gov.in)) अथवा SSO पोर्टल के माध्यम से ऑनलाइन आवेदन होता है।\n` +
        `- **सीधा द्वितीय वर्ष (Lateral Entry):** 12वीं विज्ञान (PCM) अथवा 2-वर्षीय ITI डिप्लोमा धारक सीधे द्वितीय वर्ष में प्रवेश ले सकते हैं।`;
    }
    if (isPlace) {
      return `### 🏛️ ${collegeDisplay} — प्लेसमेंट विवरण (प्रज्ञा AI)\n\n` +
        `**💼 प्लेसमेंट एवं प्रमुख कंपनियाँ (Placements):**\n` +
        `- **औसत पैकेज:** **₹2.80 - ₹3.60 लाख प्रति वर्ष (LPA)**\n` +
        `- **उच्चतम पैकेज:** **₹5.50 - ₹6.50 LPA तक**\n` +
        `- **प्रमुख भर्तीकर्ता:** Tata Motors, Maruti Suzuki, L&T Construction, Hero MotoCorp, Havells, Subros, Jindal Steel, Daikin आदि।`;
    }
    if (isHostel) {
      return `### 🏛️ ${collegeDisplay} — छात्रावास सुविधा (प्रज्ञा AI)\n\n` +
        `**🏠 छात्रावास एवं भोजन सुविधा (Hostel & Mess):**\n` +
        `- परिसर में छात्रों और छात्राओं के लिए पृथक एवं सुरक्षित छात्रावास उपलब्ध हैं।\n` +
        `- **हॉस्टल किराया:** लगभग ₹2,500 - ₹3,500 प्रति वर्ष (कमरे का किराया)।\n` +
        `- **सुविधाएं:** स्वच्छ मेस, RO पेयजल, हाई-स्पीड वाई-फाई, 24/7 सुरक्षा, खेल मैदान और जिम।`;
    }
    if (isBranch) {
      return `### 🏛️ ${collegeDisplay} — उपलब्ध शाखाएं (प्रज्ञा AI)\n\n` +
        `**🎓 उपलब्ध शाखाएं (Branches & Courses):**\n` +
        `- कंप्यूटर साइंस एंड इंजीनियरिंग (CSE)\n` +
        `- सिविल इंजीनियरिंग (Civil)\n` +
        `- इलेक्ट्रिकल इंजीनियरिंग (Electrical)\n` +
        `- मैकेनिकल इंजीनियरिंग (Mechanical)\n` +
        `- इलेक्ट्रॉनिक्स एवं ऑटोमोबाइल इंजीनियरिंग\n` +
        `- प्रत्येक शाखा में 40 से 60 सीटें स्वीकृत हैं।`;
    }
    if (isScholarship) {
      return `### 🏛️ ${collegeDisplay} — छात्रवृत्ति योजनाएं (प्रज्ञा AI)\n\n` +
        `**🎓 छात्रवृत्ति योजनाएं (Scholarships):**\n` +
        `- **मुख्यमंत्री उच्च शिक्षा छात्रवृत्ति योजना:** मेधावी छात्रों को ₹5,000 प्रति वर्ष।\n` +
        `- **उत्तर मैट्रिक छात्रवृत्ति (SJED):** SC/ST/OBC/EWS छात्रों के लिए पूरी फीस प्रतिपूर्ति।\n` +
        `- **AICTE प्रगति छात्रवृत्ति:** छात्राओं को ₹50,000 प्रति वर्ष।\n` +
        `- **AICTE सक्षम छात्रवृत्ति:** दिव्यांग छात्रों के लिए ₹50,000 प्रति वर्ष।`;
    }
    if (isContact) {
      return `### 🏛️ ${collegeDisplay} — संपर्क एवं हेल्पलाइन (प्रज्ञा AI)\n\n` +
        `**📞 संपर्क एवं हेल्पलाइन (Contact Details):**\n` +
        `- **राजस्थान छात्र हेल्पलाइन (Toll-Free):** 1800-180-6127\n` +
        `- **आधिकारिक पोर्टल:** [hte.rajasthan.gov.in](https://hte.rajasthan.gov.in)\n` +
        `- संस्थान संबंधी विशिष्ट जानकारी हेतु प्राचार्य कार्यालय से संपर्क करें।`;
    }

    return `### 🏛️ ${collegeDisplay} — जानकारी (प्रज्ञा AI)\n\n` +
      `नमस्ते! ${collegeDisplay} के संदर्भ में सत्यापित विवरण:\n\n` +
      (chunks[0] || "राजस्थान तकनीकी शिक्षा संस्थानों में प्रवेश एवं अध्ययन संबंधी समस्त जानकारी उपलब्ध है।") +
      `\n\n📌 आप कॉलेज की फीस, प्रवेश प्रक्रिया, शाखाएं, हॉस्टल, छात्रवृत्ति या प्लेसमेंट से संबंधित कोई भी विशिष्ट प्रश्न पूछ सकते हैं।`;
  }

  // English fallback
  if (isFee) {
    return `### 🏛️ ${collegeDisplay} — Fee Structure (Pragya AI)\n\n` +
      `**💰 Fee Structure & Exemptions:**\n` +
      `- **Government Aided Seat (GAS):** Approx **₹7,200 per annum**\n` +
      `- **Self-Financed Seat (SFS):** Approx **₹21,000 per annum**\n` +
      `- **Caution Money:** ₹1,000 (One-time, 100% Refundable)\n` +
      `- **Tuition Waiver Policy:** **100% Tuition fee exemption** for all female candidates in Government seats and full reimbursement for SC/ST and BPL students under Rajasthan Government schemes.`;
  }
  if (isAdm) {
    return `### 🏛️ ${collegeDisplay} — Admission Process & Eligibility (Pragya AI)\n\n` +
      `**📝 Admission Process & Eligibility:**\n` +
      `- **Eligibility:** Passed Class 10th (Secondary) examination with Science & Mathematics with a minimum of **35% aggregate marks**.\n` +
      `- **Centralized Admission:** Conducted by Department of Technical Education (DTE), Rajasthan via [hte.rajasthan.gov.in](https://hte.rajasthan.gov.in) or SSO ID.\n` +
      `- **Lateral Entry (Direct 2nd Year):** Available for candidates with 12th Science (PCM) or 2-year ITI trade certificate in a relevant branch.`;
  }
  if (isPlace) {
    return `### 🏛️ ${collegeDisplay} — Placements & Recruiters (Pragya AI)\n\n` +
      `**💼 Placement Highlights & Top Recruiters:**\n` +
      `- **Average Package:** **₹2.80 - ₹3.60 LPA**\n` +
      `- **Highest Package:** **₹5.50 - ₹6.50 LPA**\n` +
      `- **Placement Rate:** ~80% - 88% in core engineering and tech companies.\n` +
      `- **Top Recruiters:** Tata Motors, Maruti Suzuki, L&T, Hero MotoCorp, Havells, Subros, Jindal Steel, Daikin, Ashok Leyland.`;
  }
  if (isHostel) {
    return `### 🏛️ ${collegeDisplay} — Hostel & Campus Amenities (Pragya AI)\n\n` +
      `**🏠 Hostel & Campus Facilities:**\n` +
      `- Dedicated and secure boys' and girls' hostels on campus.\n` +
      `- **Hostel Room Rent:** Approx ₹2,500 - ₹3,500 per annum + mess charges.\n` +
      `- **Amenities:** Hygienic cooperative mess, RO drinking water, high-speed Wi-Fi, 24/7 security guards, reading room, sports grounds.`;
  }
  if (isBranch) {
    return `### 🏛️ ${collegeDisplay} — Available Courses (Pragya AI)\n\n` +
      `**🎓 Available Branches & Intake:**\n` +
      `- Computer Science & Engineering (60 Seats)\n` +
      `- Civil Engineering (60 Seats)\n` +
      `- Electrical Engineering (60 Seats)\n` +
      `- Mechanical Engineering (60 Seats)\n` +
      `- Electronics / Automobile / Chemical Engineering (30-40 Seats)`;
  }
  if (isScholarship) {
    return `### 🏛️ ${collegeDisplay} — Scholarships (Pragya AI)\n\n` +
      `**🎖️ Government Scholarships & Financial Aid:**\n` +
      `- **Mukhyamantri Uchh Shiksha Chhatravriti:** ₹5,000 annually for top merit students.\n` +
      `- **SJED Post-Matric Scholarship:** Up to 100% fee reimbursement for SC/ST/OBC (BPL)/EWS students.\n` +
      `- **AICTE Pragati Scholarship for Girls:** ₹50,000 per year.\n` +
      `- **AICTE Saksham Scholarship:** ₹50,000 per year for differently-abled students.`;
  }
  if (isContact) {
    return `### 🏛️ ${collegeDisplay} — Contact & Helpline (Pragya AI)\n\n` +
      `**📞 Contact & Helpline:**\n` +
      `- **Toll-Free Rajasthan Student Helpline:** 1800-180-6127\n` +
      `- **Official Website:** [hte.rajasthan.gov.in](https://hte.rajasthan.gov.in)\n` +
      `- For institution-specific queries, reach out to the College Principal Office via the official portal.`;
  }

  return `### 🏛️ ${collegeDisplay} — Information (Pragya AI)\n\n` +
    `Here is the verified information regarding your query:\n\n` +
    (chunks[0] || `Information for ${collegeDisplay} is regulated under Department of Technical Education, Rajasthan.`) +
    (chunks[1] ? `\n\n${chunks[1]}` : '') +
    `\n\n💡 *Tip: Feel free to ask about Fees, Admissions, Eligibility, Cutoffs, Hostels, or Placement records!*`;
}

export async function askGeminiOrFallback(query: string, collegeCode: string, lang: string): Promise<string> {
  const collegeData = COLLEGES_DB[collegeCode] || COLLEGES_DB["gpcajmer"];
  const collegeChunks = jsonToChunks(collegeData);
  const dteChunks = jsonToChunks(COLLEGES_DB["general_rajasthan_dte"]);
  const allChunks = [...collegeChunks, ...dteChunks];

  const geminiApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  if (geminiApiKey && geminiApiKey.startsWith("AIza") && geminiApiKey.length > 20) {
    try {
      const systemPrompt = `You are 'Pragya' (प्रज्ञा), an intelligent AI Student Assistance Chatbot for the Department of Technical Education (DTE), Government of Rajasthan.
Your duty is to assist students, parents, and stakeholders with accurate, welcoming, and clear information about technical colleges (polytechnic and engineering) in Rajasthan.

Guidelines:
1. Provide your answer in the requested language: ${lang} (e.g. English, Hindi, Rajasthani).
2. Answer based on the provided Context below.
3. If the context contains details like fees, cutoffs, or branches, format them using clean markdown tables or bullet points.
4. Maintain a polite, professional, and encouraging government student-help tone.
5. If the context does not contain enough information, politely explain and provide the DTE toll-free helpline: 1800-180-6127 or portal hte.rajasthan.gov.in.`;

      const prompt = `${systemPrompt}\n\nCollege: ${collegeCode}\nContext:\n${allChunks.join('\n\n---\n\n')}\n\nStudent Question: ${query}\nAnswer:`;

      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 800
          }
        })
      });

      if (res.ok) {
        const data = await res.json();
        const candidate = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidate && candidate.trim().length > 0) {
          return candidate.trim();
        }
      }
    } catch (err) {
      console.warn("Gemini API call failed, falling back to native synthesizer:", err);
    }
  }

  // Native Synthesizer Fallback
  return synthesizeNativeResponse(query, collegeCode, allChunks, lang);
}
