import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Geneseon Academy",
    short_name: "Geneseon",
    description: "SSC, HSC ও চাকরি প্রস্তুতির শিক্ষামূলক প্ল্যাটফর্ম",
    start_url: "/index.html",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#991B1B",
    icons: [
      {
        src: "/images/pwa-icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/images/pwa-icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/images/pwa-icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
