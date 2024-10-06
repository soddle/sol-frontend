import React from "react";
import AttributesGamePageClient from "./attributesGameClient";
import { fetchKOLs } from "@/lib/api";

async function AttributesGamePage() {
  const kols = await fetchKOLs();
  console.log(kols);
  return <AttributesGamePageClient kols={kols} />;
}

export default AttributesGamePage;
