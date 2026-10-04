import { createClient } from '@libsql/client';

const DEFAULT_URL = 'libsql://dsc-dscsrmrmp.aws-ap-south-1.turso.io';
const DEFAULT_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODk0MDcxNTEsImlkIjoiMDFhMGEwZjktYjYwMS03ZGJlLTkzMTQtZmNkMDVhNDVlNDhhIiwia2lkIjoiWFpUMjFKc1dfaVNic1pLYnJXMUZJbFZMS3FIdEQxVGpiUnctbWJtZTNjVSIsInJpZCI6IjkwMjliZjdlLTZiYTMtNDc2ZC1hMGY4LWZhNTFlNjk5Y2E0NSJ9.MJNEDy8E20dSCd1FeFKjRDHeSxVfI45Qe8Od9NTlYopqBU_jNgROhYUtNDynUX_OQG5UNszjm4cqheC2hmKtBQ';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL || DEFAULT_URL,
  authToken: process.env.TURSO_AUTH_TOKEN || DEFAULT_TOKEN,
});

// Clean helper: converts empty strings, '-' or invalid placeholders to null
function cleanVal(val) {
  if (!val) return null;
  const trimmed = val.trim();
  if (!trimmed || trimmed === '-' || trimmed.toLowerCase() === 'instagram' || trimmed.toLowerCase() === 'x(twitter)') {
    return null;
  }
  return trimmed;
}

function cleanGithub(val) {
  const cleaned = cleanVal(val);
  if (!cleaned) return null;
  if (cleaned.startsWith('http://') || cleaned.startsWith('https://')) {
    return cleaned;
  }
  // Extract handle if format is e.g. "yogzxx16 (YOGESHKUMAR S )"
  const match = cleaned.match(/^([a-zA-Z0-9_-]+)/);
  if (match) {
    return `https://github.com/${match[1]}`;
  }
  return cleaned;
}

// 1. President
const presidentList = [
  {
    name: 'KHUSHAL MITTAL',
    img: 'https://cdn.developerstudents.club/team/KHUSHAL_MITTAL.png',
    team: 'PRESIDENT',
    insta: 'https://www.instagram.com/_____khush_______?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==',
    linkedin: 'https://www.linkedin.com/in/khushal-mittal-217148325?originalSubdomain=in',
    x: 'https://x.com/Khush_285',
    lead: 1,
    github: 'https://github.com/Khush285',
  }
];

// 2. Technical Lead
const techLeadList = [
  {
    name: 'K SRIVARSAN',
    img: 'https://cdn.developerstudents.club/team/SRIVARSAN_K.png',
    team: 'TECHNICAL LEAD',
    insta: 'https://www.instagram.com/srivarsankannan/',
    linkedin: 'https://www.linkedin.com/in/ksrivarsan',
    x: 'https://x.com/SrivarsanK',
    lead: 1,
    github: 'https://github.com/SrivarsanK',
  }
];

// 3. Operations Lead
const opsLeadList = [
  {
    name: 'SAGARIKA MISRA',
    img: 'https://cdn.developerstudents.club/team/Sagarika__Mishra.png',
    team: 'OPERATIONS LEAD',
    insta: 'https://www.instagram.com/sagarika7_/',
    linkedin: 'https://www.linkedin.com/in/sagarika-mishra-ab151a358/',
    x: 'https://x.com/Sagarik66632312',
    lead: 1,
    github: 'https://github.com/sagm07',
  }
];

// 4. Creatives Lead
const creativesLeadList = [
  {
    name: 'SHRIRAKSHA S',
    img: 'https://cdn.developerstudents.club/team/S.SHRIRAKSHA.jpeg',
    team: 'CREATIVES LEAD',
    insta: 'https://www.instagram.com/sothappalsha?igsh=MWlseGFodWE3dG1iMg%3D%3D&utm_source=qr',
    linkedin: 'https://www.linkedin.com/in/shri-raksha-s-9217b6322?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app',
    x: null,
    lead: 1,
    github: 'https://github.com/Shri-Raksha2107',
  }
];

// 5. Technical Members (including HARDWARE members shown under Technical)
const techMembersList = [
  {
    name: 'ABHILASH MAHATA',
    img: 'https://cdn.developerstudents.club/team/Abhilash_Mahata.png',
    team: 'TECHNICAL',
    insta: 'https://www.instagram.com/abhi726_?igsh=MW16eDNnN3ozMTUzdw==',
    linkedin: 'https://www.linkedin.com/in/abhilash-mahata-334390331',
    x: 'https://x.com/Abhilash1690532',
    lead: 0,
    github: 'https://github.com/abhiMahata',
  },
  {
    name: 'ANKIT MUKHERJEE',
    img: '',
    team: 'HARDWARE',
    insta: 'https://www.instagram.com/mashirgudh',
    linkedin: 'https://www.linkedin.com/in/ankitmukherjeee/',
    x: null,
    lead: 0,
    github: 'https://github.com/M3rcuryLake/',
  },
  {
    name: 'CHOUHAN TEJ',
    img: 'https://cdn.developerstudents.club/team/Chouhan_Tej.png',
    team: 'TECHNICAL',
    insta: 'https://www.instagram.com/ada.ponga.daa.dei/',
    linkedin: 'https://www.linkedin.com/in/chouhan-tej-386a672aa',
    x: 'https://x.com/ChouhanTej1',
    lead: 0,
    github: 'https://github.com/ChouhanTej',
  },
  {
    name: 'DHANESH VINOD TANDALE',
    img: 'https://cdn.developerstudents.club/team/Dhanesh_Tandale.jpeg',
    team: 'TECHNICAL',
    insta: 'https://www.instagram.com/dan_26_07/',
    linkedin: 'https://www.linkedin.com/in/dhanesh-tandale-7173ab347/',
    x: null,
    lead: 0,
    github: 'https://github.com/Dan-Z-26',
  },
  {
    name: 'G MADHUMITHA',
    img: 'https://cdn.developerstudents.club/team/Madhumitha.png',
    team: 'TECHNICAL',
    insta: 'https://www.instagram.com/mad20_67?igsh=MTBtZTdibWJ3ZHZwYQ==',
    linkedin: 'https://www.linkedin.com/in/madhumitha-g-57b37337b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
    x: null,
    lead: 0,
    github: 'https://github.com/Madhu-206207',
  },
  {
    name: 'KAAVIYA',
    img: 'https://cdn.developerstudents.club/team/Kaaviya.png',
    team: 'TECHNICAL',
    insta: 'https://www.instagram.com/kaavi7ya?stkn=MXd5OXF3MWkxbDkydA==',
    linkedin: 'https://www.linkedin.com/in/kaaviya-varshini-v-b32480388?utm_source=share_via&utm_content=profile&utm_medium=member_android',
    x: 'https://x.com/KaaviyaVarsh',
    lead: 0,
    github: 'https://github.com/kaaviyavarshini',
  },
  {
    name: 'MAYUKH MUKHOPADHYAY',
    img: '',
    team: 'HARDWARE',
    insta: 'https://www.instagram.com/mayukh.mukhopadhyay?stkn=MXhzMTFwbG5zeGRvMQ==',
    linkedin: 'https://www.linkedin.com/in/mayukh-mukhopadhyay?utm_source=share_via&utm_content=profile&utm_medium=member_android',
    x: null,
    lead: 0,
    github: 'https://github.com/MayukhMh',
  },
  {
    name: 'PRANES KUMAR B',
    img: 'https://cdn.developerstudents.club/team/Pranes_Kumar_B.png',
    team: 'TECHNICAL',
    insta: 'https://www.instagram.com/prxnes07?stkn=MWlweTFjY3RncHZsaw==',
    linkedin: 'https://www.linkedin.com/in/praneskumarb',
    x: null,
    lead: 0,
    github: 'https://github.com/pranesdev',
  },
  {
    name: 'SHAIK AHAMED',
    img: 'https://cdn.developerstudents.club/team/Ahamed_-_Tauqeer_Ahamed.png',
    team: 'TECHNICAL',
    insta: 'https://www.instagram.com/cid_wala_banda_huuu?igsh=N2x1MDk5cHZ6MDJs',
    linkedin: 'https://www.linkedin.com/in/tauqeer-ahamed-596533327?utm_source=share_via&utm_content=profile&utm_medium=member_android',
    x: 'https://x.com/TauqeerAha83249',
    lead: 0,
    github: 'https://github.com/tauqeerahamed07',
  },
  {
    name: 'THAVANESH CM',
    img: 'https://cdn.developerstudents.club/team/Thavanesh_CM.png',
    team: 'TECHNICAL',
    insta: 'https://www.instagram.com/thavanesh.cm?igsh=MWttN20xN3I2ZzN3YQ==',
    linkedin: 'https://www.linkedin.com/in/thavanesh-cm-9130ba380',
    x: 'https://x.com/thavaneshcm',
    lead: 0,
    github: 'https://github.com/thavanesh-cm',
  },
  {
    name: 'YOGESHKUMAR S',
    img: 'https://cdn.developerstudents.club/team/YOGESHKUMAR_S.jpeg',
    team: 'TECHNICAL',
    insta: null,
    linkedin: 'https://www.linkedin.com/in/yogeshkumar-s-tech',
    x: null,
    lead: 0,
    github: 'https://github.com/yogzxx16',
  }
];

// 6. Operations Members
const opsMembersList = [
  {
    name: 'ANIRUDH HARISH',
    img: 'https://cdn.developerstudents.club/team/Anirudh_Harish.png',
    team: 'OPERATIONS',
    insta: 'https://www.instagram.com/__anirudh98___?stkn=azZ1cDE3cHhqNnh1',
    linkedin: 'https://www.linkedin.com/in/anirudh-harish-625a3929a/?isSelfProfile=true',
    x: null,
    lead: 0,
    github: 'https://github.com/AnirudhHarish07',
  },
  {
    name: 'ASHWIN B.G',
    img: 'https://cdn.developerstudents.club/team/B.G._Ashwin.png',
    team: 'OPERATIONS',
    insta: 'https://www.instagram.com/_ashwin__1926?igsh=MWR4ZWVwZnB3ejhwdA%3D%3D&utm_source=qr',
    linkedin: 'https://www.linkedin.com/in/b-g-ashwin-aa2749199/',
    x: null,
    lead: 0,
    github: 'https://github.com/bgashwin13-CS',
  },
  {
    name: 'VIJAY ARAVINDRAM S A',
    img: 'https://cdn.developerstudents.club/team/VIJAY_ARAVINDRAM_S_A.jpg',
    team: 'OPERATIONS',
    insta: 'https://www.instagram.com/vijay_aravindram?igsh=aWdzYWt4eXZtaTdm',
    linkedin: 'https://www.linkedin.com/in/vijay-aravindram-s-a-53b39431a',
    x: 'https://x.com/Vijay_Arav_07',
    lead: 0,
    github: 'https://github.com/Vijay2007-coder',
  }
];

// 7. Creatives Members
const creativesMembersList = [
  {
    name: 'ANDREA SUNIL',
    img: 'https://cdn.developerstudents.club/team/andrea_-_Andrea.jpg',
    team: 'CREATIVES',
    insta: 'https://www.instagram.com/_.andreaa.t/',
    linkedin: 'https://www.linkedin.com/in/andrea-sunil-b366b3380',
    x: 'https://x.com/andreasunil24',
    lead: 0,
    github: 'https://github.com/andreasunil24-ctrl',
  },
  {
    name: 'DEEPAK P J',
    img: 'https://cdn.developerstudents.club/team/pavi_deepam.png',
    team: 'CREATIVES',
    insta: 'https://www.instagram.com/_depaak._?igsh=aDltczJydXRhbXdn',
    linkedin: 'https://www.linkedin.com/in/deepak-p-j-16862837b?utm_source=share_via&utm_content=profile&utm_medium=member_android',
    x: 'https://x.com/Depaak1807',
    lead: 0,
    github: 'https://github.com/DEEPAK18-12',
  },
  {
    name: 'DHANYA SENTHIL ARASU',
    img: 'https://cdn.developerstudents.club/team/DHANYA_SENTHIL_ARASU_.png',
    team: 'CREATIVES',
    insta: 'https://www.instagram.com/dhandazzle?igsh=MWZucXBkbXd1dTluNQ==',
    linkedin: 'https://www.linkedin.com/in/dhanyasenthilarasu/',
    x: null,
    lead: 0,
    github: 'https://github.com/dhanyasenthilars',
  },
  {
    name: 'G. RAMYASHREE',
    img: 'https://cdn.developerstudents.club/team/G.Ramyashree.png',
    team: 'CREATIVES',
    insta: 'https://www.instagram.com/_.moonlight_galaxy._?igsh=ZnFxajUzYzZhdnRo',
    linkedin: 'https://www.linkedin.com/in/ramyashree-g-4a5906336?utm_source=share_via&utm_content=profile&utm_medium=member_android',
    x: null,
    lead: 0,
    github: 'https://github.com/gramyashree',
  },
  {
    name: 'KANISHKA SHARMA',
    img: 'https://cdn.developerstudents.club/team/Kanishka_-_KANISHKA_SHARMA.jpeg',
    team: 'CREATIVES',
    insta: 'https://www.instagram.com/kanishka_3124',
    linkedin: 'https://www.linkedin.com/in/kanishka-sharma-bb8981350/',
    x: 'https://x.com/Kanishka_3125',
    lead: 0,
    github: 'https://github.com/kanishka3125',
  },
  {
    name: 'MANVI SRIVASTAVA',
    img: 'https://cdn.developerstudents.club/team/Manvi_Srivastava.jpg',
    team: 'CREATIVES',
    insta: 'https://www.instagram.com/maan._.we?stkn=aWxqcW1xYjRoeno=',
    linkedin: 'https://www.linkedin.com/in/manvi-srivastava-68893032a',
    x: null,
    lead: 0,
    github: 'https://github.com/Manvi1023',
  },
  {
    name: 'PRABHA',
    img: 'https://cdn.developerstudents.club/team/Prabha.png',
    team: 'CREATIVES',
    insta: 'https://www.instagram.com/prabha_t_r_?stkn=MWpqaWNyNzFzMzBpdA==',
    linkedin: 'https://www.linkedin.com/in/prabha-tr04/',
    x: 'https://x.com/_prabha_04',
    lead: 0,
    github: 'https://github.com/prabha-stack04',
  },
  {
    name: 'SAI SRI KIRAN S',
    img: 'https://cdn.developerstudents.club/team/Sai_Sri_Kiran_S.png',
    team: 'CREATIVES',
    insta: 'https://www.instagram.com/shaye.mov?igsh=MXhlZnh1M25wZ3Bjdg==',
    linkedin: 'https://www.linkedin.com/in/saisrikiran?utm_source=share_via&utm_content=profile&utm_medium=member_android',
    x: 'https://x.com/Sanzaneig',
    lead: 0,
    github: 'https://github.com/sanzane',
  },
  {
    name: 'SREEDEV D S',
    img: 'https://cdn.developerstudents.club/team/SREEDEV.png',
    team: 'CREATIVES',
    insta: 'https://www.instagram.com/sreed__v',
    linkedin: 'https://www.linkedin.com/in/sreedev-d-s-854b10330?utm_source=share_via&utm_content=profile&utm_medium=member_android',
    x: 'https://x.com/SREEDEV18270',
    lead: 0,
    github: 'https://github.com/Sreedevds',
  }
];

// Combine in strict priority order and assign 1-based sequential IDs
const prioritizedList = [
  ...presidentList,
  ...techLeadList,
  ...opsLeadList,
  ...creativesLeadList,
  ...techMembersList,
  ...opsMembersList,
  ...creativesMembersList,
].map((member, idx) => ({
  id: idx + 1,
  ...member,
}));

console.log(`Total prioritized members to insert: ${prioritizedList.length}`);

async function run() {
  try {
    // 1. Clear existing rows in team_members
    console.log('Clearing existing team_members table...');
    await client.execute('DELETE FROM team_members;');

    // 2. Insert all prioritized members
    console.log('Inserting prioritized members...');
    const statements = prioritizedList.map((m) => ({
      sql: `INSERT INTO team_members (id, name, img, team, insta, linkedin, x, lead, github)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [m.id, m.name, m.img, m.team, m.insta, m.linkedin, m.x, m.lead, m.github],
    }));

    await client.batch(statements, 'write');

    // 3. Verify inserted data
    const countRes = await client.execute('SELECT COUNT(*) as count FROM team_members;');
    console.log('Verified row count:', countRes.rows[0].count);

    const checkRes = await client.execute('SELECT id, name, team, lead FROM team_members ORDER BY id ASC;');
    console.log('All members in database:');
    console.table(checkRes.rows);
  } catch (err) {
    console.error('Error updating Turso team_members:', err);
    process.exit(1);
  } finally {
    client.close();
  }
}

run();
