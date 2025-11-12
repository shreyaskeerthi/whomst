export interface Candidate {
  id: string;
  name: string;
  state: string;  // State abbreviation
  city?: string;  // Optional city
  level: 'local' | 'state' | 'federal';
  axes: {
    economic: number;  // -10 (left) to 10 (right)
    social: number;    // -10 (libertarian) to 10 (authoritarian)
    global: number;    // -10 (nationalist) to 10 (globalist)
  };
  topics: {
    economy: number;
    rights: number;
    foreign: number;
    climate: number;
    housing: number;
    education: number;
    health: number;
    justice: number;
  };
  bio: string;
  url?: string;
}

export const candidates: Candidate[] = [
  // Illinois
  {
    id: "johnson",
    name: "Brandon Johnson",
    state: "IL",
    city: "Chicago",
    level: "local",
    axes: { economic: -7.5, social: -3.2, global: 2.5 },
    topics: { economy: -7, rights: -6, foreign: 2, climate: -6, housing: -8, education: -7, health: -7, justice: -4 },
    bio: "57th Mayor of Chicago; former teacher and county commissioner; progressive focus on schools, housing, and social services.",
    url: "https://www.chicago.gov/city/en/depts/mayor.html"
  },
  {
    id: "pritzker",
    name: "JB Pritzker",
    state: "IL",
    level: "state",
    axes: { economic: -6.2, social: -4.6, global: 4.0 },
    topics: { economy: -6, rights: -7, foreign: 4, climate: -5, housing: -5, education: -6, health: -7, justice: -2 },
    bio: "43rd Governor of Illinois; advanced abortion access, LGBTQ+ protections, and major budget/tax reforms.",
    url: "https://gov.illinois.gov/about/the-governor.html"
  },
  {
    id: "duckworth",
    name: "Tammy Duckworth",
    state: "IL",
    level: "federal",
    axes: { economic: -4.8, social: -4.8, global: 5.8 },
    topics: { economy: -5, rights: -6, foreign: 6, climate: -5, housing: -4, education: -5, health: -6, justice: 0 },
    bio: "U.S. Senator; Iraq War veteran and Purple Heart recipient; center‑left on economics, pro‑alliances on foreign policy.",
    url: "https://www.duckworth.senate.gov/about-tammy/biography"
  },

  // New York
  {
    id: "adams",
    name: "Eric Adams",
    state: "NY",
    city: "New York City",
    level: "local",
    axes: { economic: -3.0, social: 3.5, global: 3.0 },
    topics: { economy: -3, rights: -2, foreign: 3, climate: -2, housing: -3, education: -3, health: -3, justice: 4 },
    bio: "110th Mayor of NYC; ex‑NYPD captain and former Brooklyn Borough President; centrist focus on public safety and growth.",
    url: "https://www.nyc.gov/mayors-office/mayors-bio"
  },
  {
    id: "hochul",
    name: "Kathy Hochul",
    state: "NY",
    level: "state",
    axes: { economic: -4.5, social: -3.5, global: 5.0 },
    topics: { economy: -5, rights: -5, foreign: 5, climate: -4, housing: -3, education: -4, health: -5, justice: -1 },
    bio: "57th Governor of New York; first woman to hold the office; moderate Democrat balancing public safety and affordability.",
    url: "https://www.governor.ny.gov/about-governor-hochul"
  },
  {
    id: "ocasio-cortez",
    name: "Alexandria Ocasio-Cortez",
    state: "NY",
    level: "federal",
    axes: { economic: -8.8, social: -7.8, global: 6.5 },
    topics: { economy: -9, rights: -9, foreign: 7, climate: -9, housing: -8, education: -8, health: -9, justice: -6 },
    bio: "U.S. Representative; progressive Democrat and Green New Deal advocate.",
    url: "https://ocasio-cortez.house.gov/about"
  },
  {
    id: "cuomo",
    name: "Andrew Cuomo",
    state: "NY",
    level: "state",
    axes: { economic: -3.8, social: 2.5, global: 5.5 },
    topics: { economy: -4, rights: -3, foreign: 6, climate: -3, housing: -2, education: -3, health: -4, justice: 3 },
    bio: "Former 56th Governor of New York; centrist Democrat known for large infrastructure projects and pandemic response.",
    url: "https://www.andrewcuomo.com/about"
  },
  {
    id: "mamdani",
    name: "Zohran Mamdani",
    state: "NY",
    city: "New York City",
    level: "state",
    axes: { economic: -9.2, social: -8.4, global: 5.8 },
    topics: { economy: -9, rights: -9, foreign: 6, climate: -9, housing: -10, education: -9, health: -9, justice: -7 },
    bio: "New York State Assembly member; democratic socialist focused on tenant and housing justice.",
    url: "https://nyassembly.gov/mem/Zohran-K-Mamdani"
  },
  {
    id: "sliwa",
    name: "Curtis Sliwa",
    state: "NY",
    city: "New York City",
    level: "local",
    axes: { economic: 4.5, social: 6.8, global: -3.2 },
    topics: { economy: 5, rights: 4, foreign: -3, climate: 3, housing: 2, education: 3, health: 4, justice: 8 },
    bio: "Guardian Angels founder; Republican mayoral candidate emphasizing policing and public safety.",
    url: "https://www.sliwafornyc.com/meet-curtis"
  },

  // California
  {
    id: "bass",
    name: "Karen Bass",
    state: "CA",
    city: "Los Angeles",
    level: "local",
    axes: { economic: -6.2, social: -5.0, global: 5.0 },
    topics: { economy: -6, rights: -7, foreign: 5, climate: -7, housing: -8, education: -6, health: -6, justice: -4 },
    bio: "43rd Mayor of Los Angeles; former U.S. Representative and CBC chair; progressive with a focus on homelessness.",
    url: "https://mayor.lacity.gov/about-mayor-karen-bass"
  },
  {
    id: "newsom",
    name: "Gavin Newsom",
    state: "CA",
    level: "state",
    axes: { economic: -5.8, social: -6.2, global: 7.0 },
    topics: { economy: -5, rights: -8, foreign: 7, climate: -8, housing: -4, education: -5, health: -6, justice: -3 },
    bio: "40th Governor of California; progressive technocrat on climate, health, and civil rights.",
    url: "https://www.gov.ca.gov/about/"
  },
  {
    id: "schiff",
    name: "Adam Schiff",
    state: "CA",
    level: "federal",
    axes: { economic: -4.2, social: -4.0, global: 8.0 },
    topics: { economy: -4, rights: -6, foreign: 9, climate: -5, housing: -3, education: -4, health: -5, justice: -1 },
    bio: "U.S. Senator; former House Intelligence chair; liberal on civil rights and strongly internationalist.",
    url: "https://www.schiff.senate.gov/about/"
  },

  // Texas
  {
    id: "abbott",
    name: "Greg Abbott",
    state: "TX",
    level: "state",
    axes: { economic: 7.5, social: 7.8, global: -6.5 },
    topics: { economy: 8, rights: 7, foreign: -7, climate: 6, housing: 5, education: 4, health: 6, justice: 7 },
    bio: "Governor of Texas; conservative Republican emphasizing border enforcement and deregulation.",
    url: "https://gov.texas.gov/governor-abbott"
  },
  {
    id: "cruz",
    name: "Ted Cruz",
    state: "TX",
    level: "federal",
    axes: { economic: 8.2, social: 8.5, global: -8.5 },
    topics: { economy: 9, rights: 8, foreign: -9, climate: 7, housing: 6, education: 5, health: 7, justice: 8 },
    bio: "U.S. Senator; Tea Party conservative advocating limited government and strong national sovereignty.",
    url: "https://www.cruz.senate.gov/about-ted"
  },
  {
    id: "allred",
    name: "Colin Allred",
    state: "TX",
    level: "federal",
    axes: { economic: -4.0, social: -3.5, global: 3.8 },
    topics: { economy: -4, rights: -5, foreign: 4, climate: -4, housing: -3, education: -4, health: -5, justice: -2 },
    bio: "Former U.S. Representative (2019–2025); moderate Democrat and 2024 Senate candidate.",
    url: "https://history.house.gov/People/Detail/25769805223"
  },

  // Florida
  {
    id: "desantis",
    name: "Ron DeSantis",
    state: "FL",
    level: "state",
    axes: { economic: 7.8, social: 8.8, global: -7.2 },
    topics: { economy: 8, rights: 9, foreign: -7, climate: 7, housing: 6, education: 8, health: 7, justice: 8 },
    bio: "46th Governor of Florida; conservative on culture and regulation; aggressive state‑first posture.",
    url: "https://www.flgov.com/eog/leadership/people/ron-desantis"
  },
  {
    id: "rubio",
    name: "Marco Rubio",
    state: "FL",
    level: "federal",
    axes: { economic: 6.5, social: 6.2, global: -2.0 },
    topics: { economy: 7, rights: 6, foreign: -3, climate: 5, housing: 5, education: 4, health: 6, justice: 5 },
    bio: "U.S. foreign‑policy hawk from Florida; conservative economics; engaged internationally but hard‑line on China and borders.",
    url: "https://www.state.gov/" // use State Dept site if serving in the administration; otherwise his Senate site
  },

  // Presidents
  {
    id: "biden",
    name: "Joe Biden",
    state: "DE",
    level: "federal",
    axes: { economic: -4.5, social: -3.2, global: 6.8 },
    topics: { economy: -4, rights: -5, foreign: 7, climate: -5, housing: -3, education: -4, health: -5, justice: -2 },
    bio: "46th President; moderate Democrat focused on infrastructure, democracy, and international alliances.",
    url: "https://www.whitehouse.gov/administration/president-biden/"
  },
  {
    id: "trump",
    name: "Donald Trump",
    state: "FL",
    level: "federal",
    axes: { economic: 6.5, social: 7.2, global: -8.8 },
    topics: { economy: 7, rights: 7, foreign: -9, climate: 8, housing: 5, education: 6, health: 6, justice: 7 },
    bio: "45th President; populist Republican focused on tariffs, immigration restriction, and 'America First' policies.",
    url: "https://www.45office.com/"
  },
  {
    id: "obama",
    name: "Barack Obama",
    state: "IL",
    level: "federal",
    axes: { economic: -5.8, social: -5.5, global: 7.5 },
    topics: { economy: -6, rights: -7, foreign: 8, climate: -6, housing: -4, education: -6, health: -7, justice: -3 },
    bio: "44th President; progressive Democrat who expanded healthcare (ACA) and pursued multilateral diplomacy.",
    url: "https://www.obama.org/"
  },
  {
    id: "bush",
    name: "George W. Bush",
    state: "TX",
    level: "federal",
    axes: { economic: 6.8, social: 5.5, global: -2.5 },
    topics: { economy: 7, rights: 5, foreign: -3, climate: 5, housing: 4, education: 3, health: 5, justice: 4 },
    bio: "43rd President; compassionate conservative who led post-9/11 foreign policy and major tax cuts.",
    url: "https://www.bushcenter.org/"
  },
  {
    id: "clinton",
    name: "Bill Clinton",
    state: "AR",
    level: "federal",
    axes: { economic: -2.5, social: -3.8, global: 6.2 },
    topics: { economy: -2, rights: -5, foreign: 6, climate: -3, housing: -2, education: -3, health: -3, justice: 0 },
    bio: "42nd President; centrist 'New Democrat' who pursued free trade (NAFTA) and welfare reform.",
    url: "https://www.clintonfoundation.org/"
  },

  // Congressional Leaders
  {
    id: "pelosi",
    name: "Nancy Pelosi",
    state: "CA",
    level: "federal",
    axes: { economic: -5.5, social: -5.8, global: 7.8 },
    topics: { economy: -5, rights: -7, foreign: 8, climate: -6, housing: -5, education: -5, health: -6, justice: -3 },
    bio: "Former House Speaker; San Francisco liberal and skilled legislative strategist on healthcare and climate.",
    url: "https://pelosi.house.gov/"
  },
  {
    id: "mcconnell",
    name: "Mitch McConnell",
    state: "KY",
    level: "federal",
    axes: { economic: 7.5, social: 5.8, global: -4.2 },
    topics: { economy: 8, rights: 5, foreign: -4, climate: 6, housing: 5, education: 4, health: 6, justice: 5 },
    bio: "Senate Minority Leader; institutional conservative focused on judicial appointments and fiscal policy.",
    url: "https://www.mcconnell.senate.gov/"
  },
  {
    id: "schumer",
    name: "Chuck Schumer",
    state: "NY",
    level: "federal",
    axes: { economic: -4.8, social: -4.5, global: 6.5 },
    topics: { economy: -5, rights: -6, foreign: 7, climate: -5, housing: -4, education: -5, health: -5, justice: -2 },
    bio: "Senate Majority Leader; Brooklyn Democrat balancing progressive and moderate wings of party.",
    url: "https://www.schumer.senate.gov/"
  },
  {
    id: "jeffries",
    name: "Hakeem Jeffries",
    state: "NY",
    level: "federal",
    axes: { economic: -5.2, social: -5.0, global: 5.8 },
    topics: { economy: -5, rights: -6, foreign: 6, climate: -5, housing: -6, education: -5, health: -6, justice: -3 },
    bio: "House Minority Leader; Brooklyn Democrat focused on criminal justice reform and economic opportunity.",
    url: "https://jeffries.house.gov/"
  },
  {
    id: "johnson-mike",
    name: "Mike Johnson",
    state: "LA",
    level: "federal",
    axes: { economic: 7.8, social: 8.5, global: -6.5 },
    topics: { economy: 8, rights: 9, foreign: -7, climate: 7, housing: 5, education: 7, health: 7, justice: 8 },
    bio: "House Speaker; religious conservative focused on traditional values and limited government.",
    url: "https://mikejohnson.house.gov/"
  },

  // Vice Presidents & National Leaders
  {
    id: "harris",
    name: "Kamala Harris",
    state: "CA",
    level: "federal",
    axes: { economic: -5.2, social: -4.8, global: 6.5 },
    topics: { economy: -5, rights: -6, foreign: 7, climate: -6, housing: -5, education: -5, health: -6, justice: -3 },
    bio: "Vice President; former California AG and Senator; progressive prosecutor focused on equity and climate.",
    url: "https://www.whitehouse.gov/administration/vice-president-harris/"
  },
  {
    id: "vance",
    name: "JD Vance",
    state: "OH",
    level: "federal",
    axes: { economic: 3.5, social: 7.5, global: -8.2 },
    topics: { economy: 4, rights: 7, foreign: -9, climate: 6, housing: 3, education: 5, health: 4, justice: 7 },
    bio: "U.S. Senator; populist conservative and author of 'Hillbilly Elegy'; skeptical of interventionism.",
    url: "https://www.vance.senate.gov/"
  },
  {
    id: "haley",
    name: "Nikki Haley",
    state: "SC",
    level: "federal",
    axes: { economic: 6.8, social: 4.5, global: 2.5 },
    topics: { economy: 7, rights: 4, foreign: 3, climate: 5, housing: 4, education: 4, health: 5, justice: 4 },
    bio: "Former UN Ambassador and South Carolina Governor; moderate conservative with hawkish foreign policy.",
    url: "https://nikkihaley.com/"
  },
  {
    id: "pence",
    name: "Mike Pence",
    state: "IN",
    level: "federal",
    axes: { economic: 7.2, social: 7.8, global: -3.5 },
    topics: { economy: 7, rights: 8, foreign: -4, climate: 6, housing: 5, education: 6, health: 6, justice: 7 },
    bio: "Former Vice President and Indiana Governor; traditional conservative with strong religious values.",
    url: "https://www.mikepence.com/"
  },

  // National figures
  {
    id: "sanders",
    name: "Bernie Sanders",
    state: "VT",
    level: "federal",
    axes: { economic: -9.0, social: -6.2, global: 3.0 },
    topics: { economy: -9, rights: -7, foreign: 3, climate: -8, housing: -9, education: -9, health: -10, justice: -5 },
    bio: "U.S. Senator; democratic socialist advocating Medicare for All, labor power, and climate action.",
    url: "https://www.sanders.senate.gov/about-bernie/"
  },
  {
    id: "warren",
    name: "Elizabeth Warren",
    state: "MA",
    level: "federal",
    axes: { economic: -8.2, social: -5.8, global: 4.5 },
    topics: { economy: -9, rights: -7, foreign: 5, climate: -7, housing: -7, education: -8, health: -8, justice: -4 },
    bio: "U.S. Senator; progressive focused on financial regulation, antitrust, and consumer protection.",
    url: "https://www.warren.senate.gov/about/about-elizabeth"
  },
  {
    id: "hawley",
    name: "Josh Hawley",
    state: "MO",
    level: "federal",
    axes: { economic: 2.5, social: 7.8, global: -8.5 },
    topics: { economy: 3, rights: 8, foreign: -9, climate: 5, housing: 4, education: 6, health: 4, justice: 7 },
    bio: "U.S. Senator; populist conservative critical of big tech and supportive of economic nationalism.",
    url: "https://www.hawley.senate.gov/about/"
  },
  {
    id: "buttigieg",
    name: "Pete Buttigieg",
    state: "IN",
    level: "federal",
    axes: { economic: -3.5, social: -5.2, global: 7.5 },
    topics: { economy: -3, rights: -7, foreign: 8, climate: -5, education: -4, housing: -3, health: -4, justice: -2 },
    bio: "Former U.S. Transportation Secretary and South Bend mayor; technocratic liberal with pro‑alliance foreign policy.",
    url: "https://www.transportation.gov/"
  },
  {
    id: "whitmer",
    name: "Gretchen Whitmer",
    state: "MI",
    level: "state",
    axes: { economic: -5.0, social: -4.2, global: 5.2 },
    topics: { economy: -5, rights: -6, foreign: 5, climate: -5, housing: -4, education: -6, health: -6, justice: -2 },
    bio: "Governor of Michigan; pragmatic Democrat focused on abortion rights, infrastructure, and manufacturing.",
    url: "https://www.michigan.gov/whitmer"
  },
  {
    id: "desantis-vp",
    name: "Vivek Ramaswamy",
    state: "OH",
    level: "federal",
    axes: { economic: 7.0, social: 6.2, global: -6.8 },
    topics: { economy: 8, rights: 6, foreign: -7, climate: 7, housing: 5, education: 5, health: 6, justice: 6 },
    bio: "Entrepreneur and former presidential candidate; libertarian-leaning conservative focused on meritocracy.",
    url: "https://www.vivek2024.com/"
  },

  // Georgia
  {
    id: "warnock",
    name: "Raphael Warnock",
    state: "GA",
    level: "federal",
    axes: { economic: -6.2, social: -4.8, global: 4.2 },
    topics: { economy: -6, rights: -7, foreign: 4, climate: -5, housing: -5, education: -6, health: -7, justice: -3 },
    bio: "U.S. Senator; pastor and progressive Democrat focused on health care affordability and voting rights.",
    url: "https://www.warnock.senate.gov/about/"
  },
  {
    id: "kemp",
    name: "Brian Kemp",
    state: "GA",
    level: "state",
    axes: { economic: 7.0, social: 6.3, global: -4.8 },
    topics: { economy: 7, rights: 6, foreign: -5, climate: 5, housing: 5, education: 4, health: 5, justice: 6 },
    bio: "83rd Governor of Georgia; business‑friendly Republican with conservative social policy.",
    url: "https://gov.georgia.gov/about-us/about-governor-brian-p-kemp"
  },

  // Pennsylvania
  {
    id: "fetterman",
    name: "John Fetterman",
    state: "PA",
    level: "federal",
    axes: { economic: -6.6, social: -3.8, global: 2.0 },
    topics: { economy: -7, rights: -6, foreign: 2, climate: -5, housing: -6, education: -6, health: -7, justice: -4 },
    bio: "U.S. Senator; progressive populist with blue‑collar branding; left economics, mixed foreign‑policy instincts.",
    url: "https://www.fetterman.senate.gov/about-john/"
  },
  {
    id: "shapiro",
    name: "Josh Shapiro",
    state: "PA",
    level: "state",
    axes: { economic: -4.0, social: -3.6, global: 4.8 },
    topics: { economy: -4, rights: -5, foreign: 5, climate: -4, housing: -3, education: -5, health: -5, justice: -2 },
    bio: "48th Governor of Pennsylvania; pragmatic Democrat known for bipartisan deals on infrastructure and industry.",
    url: "https://www.pa.gov/governor/about/governor-josh-shapiro"
  }
];
