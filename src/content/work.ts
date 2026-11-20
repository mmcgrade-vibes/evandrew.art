export type Piece = {
  slug: string;
  title: string;
  year: number;
  medium: string;
  size: string;
  client?: string;
  description: string;
  width: number;
  height: number;
};

const heist = (rest: string) => `From the series Heist. ${rest}`;

// Order here is the order in the home page gallery.
// Not yet included (no image supplied): Portrait of Plonk (2025), Portrait of Gus and Beans (2026).
export const work: Piece[] = [
  { slug: "boosted", title: "Boosted", year: 2024, medium: "Graphite and pastel chalk", size: "24x18”", width: 1605, height: 931,
    description: heist("A marble sculpture stolen from The Nelson-Atkins Museum using graphite and pastel chalk. Hellenistic period. The exhibit was booby trapped. We lost a good man.") },
  { slug: "winston", title: "Portrait of Winston", year: 2022, medium: "Charcoal and pastel chalk", size: "12x9”", client: "Paul Fierborne", width: 2021, height: 1276,
    description: "Portrait on toned archival paper." },
  { slug: "pilfered", title: "Pilfered", year: 2025, medium: "Graphite and pastel chalk", size: "18x24”", width: 1795, height: 2400,
    description: heist("A bronze cast stolen from The Nelson-Atkins Museum using graphite and pastel chalk. French Impressionism period. The sheer scale of it called for an inside man. Everyone has a price.") },
  { slug: "willow", title: "Portrait of Willow", year: 2024, medium: "Charcoal and pastel chalk", size: "9x12”", client: "Katie McGinnis", width: 1831, height: 2400,
    description: "Portrait on toned archival paper." },
  { slug: "swiped", title: "Swiped", year: 2025, medium: "Graphite and pastel chalk", size: "24x18”", width: 2400, height: 1695,
    description: heist("A marble sculpture stolen from The Nelson-Atkins Museum using graphite and pastel chalk. Late Roman Antiquity. A botched smash-and-grab, but the driver held his nerve. We got away with what we came for.") },
  { slug: "nene", title: "Daughter’s Memory", year: 2019, medium: "Graphite, charcoal and pastel chalk", size: "24x18”", client: "Nene Taylor", width: 1115, height: 1400,
    description: "Portrait on toned archival paper." },
  { slug: "lifted", title: "Lifted", year: 2026, medium: "Graphite and pastel chalk", size: "18x12”", width: 1464, height: 2400,
    description: heist("A wooden sculpture stolen from The Nelson-Atkins Museum using graphite and pastel chalk. High Renaissance period. Our comms went down mid-extraction but professionals can improvise.") },
  { slug: "violet", title: "Portrait of Violet", year: 2024, medium: "Charcoal and pastel chalk", size: "9x12”", client: "Mike Enos", width: 1800, height: 2400,
    description: "Portrait on toned archival paper." },
  { slug: "mallards", title: "Study of Mallards", year: 2017, medium: "Charcoal and pastel chalk", size: "17x11”", width: 2400, height: 1548,
    description: "Wildlife study on toned archival paper." },
  { slug: "robbed", title: "Robbed", year: 2023, medium: "Graphite and pastel chalk", size: "12x18”", width: 1819, height: 2400,
    description: heist("A marble sculpture stolen from The Nelson-Atkins Museum using graphite and pastel chalk. The best place to hide is often in plain sight. These goods fetched a high price indeed.") },
  { slug: "charley", title: "Portrait of Charley", year: 2022, medium: "Charcoal and pastel chalk", size: "9x12”", client: "Lisa Fierborne", width: 1664, height: 2400,
    description: "Portrait on toned archival paper." },
  { slug: "sweden", title: "Swedish Town", year: 2025, medium: "Charcoal and pastel chalk", size: "9x12”", client: "Riley McMinn", width: 1799, height: 2400,
    description: "Landscape on toned archival paper." },
  { slug: "filched", title: "Filched", year: 2026, medium: "Graphite and pastel chalk", size: "18x12”", width: 1383, height: 2400,
    description: heist("A bronze cast stolen from a private collection using graphite and pastel chalk. Neoclassical period. My identity was nearly compromised but I pivoted during the interrogation. The results are self-evident.") },
  { slug: "dottie", title: "Portrait of Dottie", year: 2025, medium: "Charcoal and pastel chalk", size: "9x12”", client: "Kate Malone", width: 1512, height: 2006,
    description: "Portrait on toned archival paper." },
  { slug: "madison", title: "Portrait of Madison", year: 2016, medium: "Graphite, charcoal and pastel chalk", size: "24x18”", width: 639, height: 627,
    description: "Chiaroscuro portrait on toned archival paper." },
  { slug: "cooper", title: "Portrait of Cooper", year: 2025, medium: "Charcoal", size: "9x12”", client: "Donaven McLaurin", width: 1209, height: 1847,
    description: "Portrait on white archival paper." },
  { slug: "roxy", title: "Portrait of Roxy", year: 2017, medium: "Charcoal", size: "17x11”", client: "Janet McMinn", width: 606, height: 495,
    description: "Portrait on toned archival paper." },
];
