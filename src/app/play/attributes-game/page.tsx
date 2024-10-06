import React from "react";
import AttributesGamePageClient from "./attributesGameClient";
import { appConfig } from "@/lib/config";

async function AttributesGamePage() {
  const response = await fetch(`${appConfig.apiBaseUrl}/api/v1/kols`, {
    cache: "no-store",
  });
  const data = await response.json();
  console.log("data:", data);

  return <AttributesGamePageClient kols={data} />;
}

export default AttributesGamePage;
