import React from "react";
import AttributesGamePageClient from "./attributesGameClient";
import { appConfig } from "@/lib/config";

async function AttributesGamePage() {
  const response = await fetch(`${appConfig.apiBaseUrl}/api/v1/kols`, {
    cache: "no-store",
  });
  const kols = await response.json();
  console.log("kols: ", kols);
  return <AttributesGamePageClient kols={kols} />;
}

export default AttributesGamePage;
