// pages/nigeria.js — Nigeria Research Page (all logged-in users)
import { useState, useEffect, useRef, useCallback } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'

const NAV_SECTIONS = [
  { id: 'live-intelligence', label: '🔴 Live Intel' },
  { id: 'power-figures', label: '👑 Power Figures' },
  { id: 'geography', label: '📍 Geography' },
  { id: 'people', label: '👥 People' },
  { id: 'government', label: '🏛️ Government' },
  { id: 'history', label: '📅 History' },
  { id: 'committees', label: '🌐 Committees' },
  { id: 'toolkit', label: '🎤 MUN Toolkit' },
]

const QUICK_STATS = [
  { label: "Population", value: "223M", unit: "Most populous in Africa" },
  { label: "Area", value: "923,768 km²", unit: "32nd globally" },
  { label: "GDP (nominal)", value: "$477B", unit: "Largest in Africa" },
  { label: "GDP per capita", value: "$2,184", unit: "USD (2023)" },
  { label: "Capital", value: "Abuja", unit: "Pop. 3.6 million" },
  { label: "Literacy Rate", value: "62%", unit: "2018 estimate" },
  { label: "Military Rank", value: "#35", unit: "of 145 nations" },
  { label: "UN Member Since", value: "1960", unit: "Independence year" },
  { label: "States", value: "36 + FCT", unit: "Administrative units" },
]

const TIMELINE = [
  { year: "~500 BC", text: "Nok civilization flourishes in central Nigeria — one of Africa's earliest known cultures, famous for terracotta sculptures." },
  { year: "1000–1400 AD", text: "Kanem-Bornu Empire dominates the Lake Chad basin. Oyo and Benin Kingdoms rise in the southwest — sophisticated states with complex governance." },
  { year: "1472", text: "Portuguese explorers arrive at the Nigerian coast. Slave trade begins — over the following centuries, millions of Nigerians are enslaved and transported to the Americas." },
  { year: "1804", text: "Usman dan Fodio launches the Fulani Jihad, establishing the Sokoto Caliphate — the largest empire in sub-Saharan Africa at the time." },
  { year: "1861", text: "Britain annexes Lagos. Gradual colonial expansion begins across what will become Nigeria." },
  { year: "1914", text: "Lord Lugard amalgamates the Northern and Southern Protectorates into the Colony and Protectorate of Nigeria — a colonial creation merging over 250 ethnic groups." },
  { year: "1960", text: "Nigeria gains independence from Britain on October 1. Abubakar Tafawa Balewa becomes first Prime Minister." },
  { year: "1966–1970", text: "Two military coups in 1966. Biafra declares independence 1967. Nigerian Civil War kills estimated 1-3 million people, many from famine." },
  { year: "1970–1979", text: "Oil boom transforms the economy. Military rule continues under Gowon, Mohammed, and Obasanjo." },
  { year: "1983–1999", text: "Series of military coups. Sani Abacha's brutal dictatorship 1993-1998. Ken Saro-Wiwa executed 1995. Nigeria isolated internationally." },
  { year: "1999", text: "Return to democracy. Olusegun Obasanjo elected president. Fourth Republic begins." },
  { year: "2009", text: "Boko Haram insurgency begins in the northeast — over 350,000 killed and 2 million displaced by 2026." },
  { year: "2014", text: "Boko Haram kidnaps 276 Chibok schoolgirls — triggering global #BringBackOurGirls campaign." },
  { year: "2015", text: "Muhammadu Buhari wins election — first peaceful transfer of power between parties in Nigerian history." },
  { year: "2023", text: "Bola Tinubu wins disputed presidential election. Removes fuel subsidy — causing severe economic crisis." },
  { year: "2024–2025", text: "Naira collapses — loses over 70% of its value. Inflation exceeds 30%. Mass protests across Nigeria." },
  { year: "March 2026", text: "Nigeria faces simultaneous crises — Boko Haram insurgency, banditry in the northwest, secessionist tensions in the southeast (IPOB), and a severe cost-of-living crisis." },
]

const VOCAB = [
  { term: "Boko Haram / ISWAP", meaning: "Islamic terrorist groups operating in northeast Nigeria and Lake Chad basin — responsible for 350,000+ deaths since 2009", why: "Central to any discussion of Nigeria's security situation and ECOSOC development agenda" },
  { term: "IPOB", meaning: "Indigenous People of Biafra — separatist movement seeking independence for the Igbo southeast", why: "Nigeria consistently frames this as a domestic security matter, rejecting any international interference" },
  { term: "Naira", meaning: "Nigeria's currency — lost over 70% of its value in 2023-2024 following subsidy removal", why: "Key to understanding Nigeria's economic crisis and development challenges" },
  { term: "Oil Dependency", meaning: "Nigeria earns ~90% of foreign exchange from oil exports — making it extremely vulnerable to price fluctuations", why: "Explains Nigeria's fiscal constraints and its advocacy for commodity price stability at ECOSOC" },
  { term: "Niger Delta", meaning: "Oil-producing region plagued by militancy, pollution, and underdevelopment despite vast oil wealth", why: "Key human rights and environmental flashpoint — relevant for ECOSOC, HRC, and UNEP" },
  { term: "Subsidy Removal", meaning: "President Tinubu ended
