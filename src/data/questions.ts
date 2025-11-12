export interface Question {
  id: number;
  text: string;
  topic: 'economy' | 'rights' | 'foreign' | 'climate' | 'housing' | 'education' | 'health' | 'justice';
  weights: {
    economic: number;   // -1 (left) to 1 (right)
    social: number;     // -1 (libertarian) to 1 (authoritarian)
    global: number;     // -1 (nationalist) to 1 (globalist)
  };
}

export const questions: Question[] = [
  {
    id: 1,
    text: "When a corporation moves production overseas, the primary responsibility should be to maximize shareholder returns, not preserve domestic jobs.",
    topic: "economy",
    weights: { economic: 0.8, social: -0.2, global: 0.7 }
  },
  {
    id: 2,
    text: "A child's access to quality education should depend primarily on local property tax revenue rather than state or federal redistribution.",
    topic: "education",
    weights: { economic: 0.6, social: 0.3, global: -0.4 }
  },
  {
    id: 3,
    text: "The U.S. should condition foreign aid and trade agreements on other countries adopting our standards for labor rights and environmental protection.",
    topic: "foreign",
    weights: { economic: -0.2, social: 0.4, global: 0.6 }
  },
  {
    id: 4,
    text: "Healthcare costs would be best controlled by allowing insurance companies to compete across state lines with minimal federal regulation.",
    topic: "health",
    weights: { economic: 0.7, social: -0.5, global: 0.2 }
  },
  {
    id: 5,
    text: "Local communities should have the right to reject housing developments, even if it means less affordable housing gets built.",
    topic: "housing",
    weights: { economic: 0.3, social: 0.5, global: -0.7 }
  },
  {
    id: 6,
    text: "Achieving racial equity requires race-conscious policies in hiring, college admissions, and government contracting.",
    topic: "rights",
    weights: { economic: -0.4, social: 0.6, global: 0.3 }
  },
  {
    id: 7,
    text: "The best way to address climate change is through international treaties that limit U.S. sovereignty over energy policy.",
    topic: "climate",
    weights: { economic: -0.5, social: 0.4, global: 0.9 }
  },
  {
    id: 8,
    text: "Successful entrepreneurs who become wealthy have earned the right to spend unlimited amounts on political campaigns and advocacy.",
    topic: "economy",
    weights: { economic: 0.9, social: -0.6, global: 0.1 }
  },
  {
    id: 9,
    text: "When local laws conflict with federal immigration enforcement, local law enforcement should prioritize community trust over cooperation with ICE.",
    topic: "justice",
    weights: { economic: 0.0, social: -0.5, global: 0.4 }
  },
  {
    id: 10,
    text: "Parents should be able to use public funds (vouchers) to send their children to religious schools that teach values different from public school curricula.",
    topic: "education",
    weights: { economic: 0.5, social: 0.7, global: -0.3 }
  },
  {
    id: 11,
    text: "American military power should be deployed primarily to protect U.S. economic interests, not to promote democracy or human rights abroad.",
    topic: "foreign",
    weights: { economic: 0.4, social: 0.2, global: -0.8 }
  },
  {
    id: 12,
    text: "Technology companies should be required to weaken encryption and build government backdoors to help law enforcement prevent terrorism.",
    topic: "rights",
    weights: { economic: 0.2, social: 0.8, global: 0.0 }
  },
  {
    id: 13,
    text: "Public employee unions (teachers, police, transit workers) have too much power and make it impossible to fire poor performers or control costs.",
    topic: "economy",
    weights: { economic: 0.7, social: 0.5, global: -0.2 }
  },
  {
    id: 14,
    text: "Drug possession should be decriminalized, with funds redirected from enforcement to treatment, even if it leads to more visible drug use in public spaces.",
    topic: "justice",
    weights: { economic: -0.3, social: -0.7, global: 0.3 }
  },
  {
    id: 15,
    text: "When housing prices rise in a neighborhood, existing residents should receive compensation or protections, even if it limits new development.",
    topic: "housing",
    weights: { economic: -0.5, social: 0.4, global: -0.5 }
  },
  {
    id: 16,
    text: "The government should actively break up or regulate tech companies to prevent monopolies, even if it means less innovation or convenience for consumers.",
    topic: "economy",
    weights: { economic: -0.6, social: 0.6, global: -0.1 }
  }
];
