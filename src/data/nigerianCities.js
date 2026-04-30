// src/data/nigerianCities.js
// Cities / major towns / LGAs for all 36 Nigerian states + FCT.
// This eliminates the need to call customers asking which city.

export const citiesByState = {
  // SOUTH-WEST
  'Lagos': [
    'Ikeja', 'Lekki', 'Ajah', 'Victoria Island', 'Ikoyi', 'Surulere',
    'Yaba', 'Mushin', 'Festac', 'Apapa', 'Ojo', 'Badagry', 'Ikorodu',
    'Epe', 'Agege', 'Alimosho', 'Oshodi', 'Maryland', 'Magodo', 'Gbagada',
    'Ojuelegba', 'Ojota', 'Lagos Island', 'Ketu', 'Mile 2', 'Sangotedo'
  ],
  'Ogun': [
    'Abeokuta', 'Sagamu', 'Ijebu Ode', 'Ifo', 'Ota', 'Ilaro', 'Ayetoro',
    'Ipokia', 'Owode', 'Mowe', 'Ibafo', 'Sango Ota', 'Agbara'
  ],
  'Oyo': [
    'Ibadan', 'Ogbomoso', 'Iseyin', 'Saki', 'Oyo', 'Eruwa', 'Igbo-Ora',
    'Kishi', 'Igboho', 'Lagelu', 'Akinyele', 'Egbeda'
  ],
  'Ondo': [
    'Akure', 'Ondo', 'Owo', 'Ikare', 'Okitipupa', 'Ore', 'Ilara-Mokin',
    'Iju-Itaogbolu', 'Idanre', 'Ifon'
  ],
  'Osun': [
    'Osogbo', 'Ile-Ife', 'Ilesa', 'Iwo', 'Ede', 'Ikirun', 'Ila-Orangun',
    'Ejigbo', 'Ikire', 'Gbongan', 'Modakeke'
  ],
  'Ekiti': [
    'Ado-Ekiti', 'Ikere-Ekiti', 'Ikole-Ekiti', 'Iyin-Ekiti', 'Ise-Ekiti',
    'Aramoko-Ekiti', 'Ido-Ekiti', 'Efon-Alaaye', 'Omuo-Ekiti', 'Oye-Ekiti'
  ],

  // SOUTH-SOUTH
  'Edo': [
    'Benin City', 'Auchi', 'Ekpoma', 'Uromi', 'Ubiaja', 'Igarra',
    'Sabongida-Ora', 'Afuze', 'Igueben', 'Abudu', 'Ekiadolor', 'Iruekpen'
  ],
  'Delta': [
    'Asaba', 'Warri', 'Sapele', 'Ughelli', 'Agbor', 'Effurun', 'Oghara',
    'Ozoro', 'Kwale', 'Burutu', 'Ogwashi-Uku', 'Oleh', 'Bomadi'
  ],
  'Rivers': [
    'Port Harcourt', 'Bonny', 'Bori', 'Omoku', 'Ahoada', 'Eleme', 'Okrika',
    'Degema', 'Abonnema', 'Buguma', 'Opobo', 'Akuku-Toru'
  ],
  'Bayelsa': [
    'Yenagoa', 'Brass', 'Sagbama', 'Ekeremor', 'Nembe', 'Kaiama',
    'Ogbia', 'Oloibiri', 'Otuoke'
  ],
  'Cross River': [
    'Calabar', 'Ikom', 'Ogoja', 'Ugep', 'Obudu', 'Akamkpa', 'Odukpani',
    'Obanliku', 'Boki', 'Bekwarra', 'Yala', 'Biase'
  ],
  'Akwa Ibom': [
    'Uyo', 'Eket', 'Ikot Ekpene', 'Oron', 'Abak', 'Itu', 'Ikot Abasi',
    'Ibiono Ibom', 'Mkpat Enin', 'Ukanafun', 'Etinan', 'Onna'
  ],

  // SOUTH-EAST
  'Anambra': [
    'Awka', 'Onitsha', 'Nnewi', 'Ekwulobia', 'Aguata', 'Ihiala', 'Ogbaru',
    'Aguleri', 'Otuocha', 'Igbo-Ukwu', 'Nkpor', 'Obosi'
  ],
  'Imo': [
    'Owerri', 'Orlu', 'Okigwe', 'Mbaise', 'Mbano', 'Oguta', 'Ohaji',
    'Oru', 'Mgbidi', 'Awo-Omamma', 'Nkwerre', 'Isu'
  ],
  'Abia': [
    'Umuahia', 'Aba', 'Ohafia', 'Arochukwu', 'Bende', 'Ikwuano', 'Isuikwuato',
    'Nnochi', 'Obingwa', 'Ugwunagbo'
  ],
  'Enugu': [
    'Enugu', 'Nsukka', 'Agbani', 'Awgu', 'Oji River', 'Udi', 'Ezeagu',
    'Ngwo', '9th Mile', 'Eha-Amufu', 'Ukehe', 'Aninri'
  ],
  'Ebonyi': [
    'Abakaliki', 'Afikpo', 'Onueke', 'Ezzamgbo', 'Ishieke', 'Ikwo', 'Edda',
    'Effium', 'Uburu', 'Okposi', 'Unwana'
  ],

  // NORTH-CENTRAL
  'FCT (Abuja)': [
    'Garki', 'Wuse', 'Maitama', 'Asokoro', 'Gwarinpa', 'Kubwa', 'Karu',
    'Nyanya', 'Lugbe', 'Bwari', 'Kuje', 'Gwagwalada', 'Abaji', 'Lokogoma',
    'Jabi', 'Utako', 'Apo', 'Mararaba'
  ],
  'Kwara': [
    'Ilorin', 'Offa', 'Omu-Aran', 'Lafiagi', 'Patigi', 'Kaiama', 'Jebba',
    'Bode Saadu', 'Share', 'Erin-Ile', 'Idofian', 'Ajasse-Ipo'
  ],
  'Kogi': [
    'Lokoja', 'Okene', 'Idah', 'Kabba', 'Ankpa', 'Ajaokuta', 'Egbe',
    'Anyigba', 'Dekina', 'Ogaminana', 'Itobe', 'Koton-Karfe'
  ],
  'Benue': [
    'Makurdi', 'Gboko', 'Otukpo', 'Katsina-Ala', 'Adikpo', 'Aliade', 'Vandeikya',
    'Ugbokolo', 'Wukari', 'Ihugh', 'Lessel', 'Naka'
  ],
  'Nasarawa': [
    'Lafia', 'Keffi', 'Akwanga', 'Nasarawa', 'Karu', 'Wamba', 'Doma',
    'Toto', 'Awe', 'Obi', 'Garaku', 'Mararaba'
  ],
  'Plateau': [
    'Jos', 'Bukuru', 'Pankshin', 'Shendam', 'Langtang', 'Wase', 'Mangu',
    'Bokkos', 'Riyom', 'Mikang', 'Quaan-Pan', 'Kanam'
  ],
  'Niger': [
    'Minna', 'Bida', 'Suleja', 'Kontagora', 'Lapai', 'Agaie', 'New Bussa',
    'Mokwa', 'Tegina', 'Wushishi', 'Rijau', 'Magama'
  ],

  // NORTH-WEST
  'Kaduna': [
    'Kaduna', 'Zaria', 'Kafanchan', 'Sabon Gari', 'Saminaka', 'Birnin Gwari',
    'Soba', 'Ikara', 'Lere', 'Jaba', 'Kachia', 'Giwa', 'Kagarko'
  ],
  'Kano': [
    'Kano', 'Wudil', 'Gwarzo', 'Bichi', 'Rano', 'Kura', 'Sumaila',
    'Tudun Wada', 'Dawakin Tofa', 'Karaye', 'Tofa', 'Shanono'
  ],
  'Katsina': [
    'Katsina', 'Daura', 'Funtua', 'Malumfashi', 'Dutsin-Ma', 'Mani',
    'Kankia', 'Kafur', 'Bakori', 'Faskari', 'Mashi', 'Ingawa'
  ],
  'Jigawa': [
    'Dutse', 'Hadejia', 'Kazaure', 'Birnin Kudu', 'Gumel', 'Ringim',
    'Kafin Hausa', 'Auyo', 'Babura', 'Gwaram', 'Maigatari', 'Roni'
  ],
  'Sokoto': [
    'Sokoto', 'Tambuwal', 'Wurno', 'Gwadabawa', 'Illela', 'Bodinga',
    'Goronyo', 'Rabah', 'Sabon Birni', 'Shagari', 'Yabo', 'Binji'
  ],
  'Kebbi': [
    'Birnin Kebbi', 'Argungu', 'Yauri', 'Zuru', 'Jega', 'Bunza', 'Aliero',
    'Augie', 'Bagudo', 'Dandi', 'Fakai', 'Maiyama'
  ],
  'Zamfara': [
    'Gusau', 'Kaura Namoda', 'Anka', 'Talata Mafara', 'Shinkafi', 'Bungudu',
    'Tsafe', 'Maradun', 'Bukkuyum', 'Gummi', 'Maru', 'Zurmi'
  ],

  // NORTH-EAST
  'Bauchi': [
    'Bauchi', 'Azare', 'Misau', 'Jamaare', 'Katagum', 'Toro', 'Ningi',
    'Tafawa Balewa', 'Alkaleri', 'Dass', 'Gamawa', 'Itas-Gadau'
  ],
  'Gombe': [
    'Gombe', 'Kaltungo', 'Billiri', 'Dukku', 'Bajoga', 'Akko', 'Kwami',
    'Nafada', 'Yamaltu', 'Balanga', 'Funakaye', 'Shongom'
  ],
  'Adamawa': [
    'Yola', 'Mubi', 'Numan', 'Jimeta', 'Ganye', 'Hong', 'Gombi',
    'Madagali', 'Michika', 'Maiha', 'Demsa', 'Fufore', 'Toungo'
  ],
  'Taraba': [
    'Jalingo', 'Wukari', 'Bali', 'Takum', 'Gembu', 'Ibi', 'Donga',
    'Ardo Kola', 'Karim Lamido', 'Lau', 'Gashaka', 'Sardauna', 'Kurmi'
  ],
  'Yobe': [
    'Damaturu', 'Potiskum', 'Gashua', 'Nguru', 'Geidam', 'Buni Yadi',
    'Bade', 'Bursari', 'Fika', 'Fune', 'Jakusko', 'Karasuwa'
  ],
  'Borno': [
    'Maiduguri', 'Biu', 'Bama', 'Gwoza', 'Konduga', 'Monguno', 'Damboa',
    'Askira-Uba', 'Magumeri', 'Mafa', 'Marte', 'Ngala', 'Nganzai'
  ],
}

// Get sorted list of cities for a state
export function getCitiesForState(stateName) {
  if (!stateName || !citiesByState[stateName]) return []
  return [...citiesByState[stateName]].sort()
}

// Cities where Pay on Delivery is allowed.
// You operate from Benin City — only POD-able location.
// To enable POD in another city later, just add it here.
export const PAY_ON_DELIVERY_CITIES = [
  { state: 'Edo', city: 'Benin City' },
]

export function isPayOnDeliveryAvailable(stateName, cityName) {
  if (!stateName || !cityName) return false
  return PAY_ON_DELIVERY_CITIES.some(
    p => p.state === stateName && p.city === cityName
  )
}
