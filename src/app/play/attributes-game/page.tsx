import React from "react";
import AttributesGamePageClient from "./attributesGameClient";
import { fetchKOLs } from "@/lib/api";
import { appConfig } from "@/lib/config";

async function AttributesGamePage() {
  const response = await fetch(`${appConfig.apiBaseUrl}/api/v1/kols`);
  const data = await response.json();
  console.log("data:", data);

  return <AttributesGamePageClient kols={data} />;
}

export default AttributesGamePage;
