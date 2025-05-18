import { redirect } from "next/navigation";

export default async function RedirectPage() {
  redirect("/admin/data-request");
}
