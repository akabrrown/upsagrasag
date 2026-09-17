// scripts/seed_page_contents.js
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !serviceKey) {
  console.error("Missing Supabase URL or Service Role Key");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

const seedData = [
  { slug: "home-hero", title: "Welcome to GRASAG UPSA", body: "Your hero description here.", image_url: null, cta_text: "Learn More", cta_link: "/about" },
  { slug: "about", title: "About Us", body: "Information about the organization.", image_url: null, cta_text: null, cta_link: null },
  { slug: "academics", title: "Academics", body: "Academic programs and details.", image_url: null, cta_text: null, cta_link: null },
  { slug: "resources", title: "Resources", body: "Useful resources and links.", image_url: null, cta_text: null, cta_link: null },
  { slug: "contact", title: "Contact", body: "How to reach us.", image_url: null, cta_text: null, cta_link: null },
];

async function seed() {
  const { data, error } = await supabase.from("page_contents").upsert(seedData, { onConflict: "slug" });
  if (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
  console.log("Seeded", data?.length ?? 0, "records");
}

seed();
