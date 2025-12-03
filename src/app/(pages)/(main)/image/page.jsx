"use client";
import { redirect } from "next/navigation";
import React, { useEffect } from "react";

export default function page() {
  useEffect(() => {
    redirect(`/image/new`);
  }, []);
  return <div>page</div>;
}
