import { createContactRequest } from "@/lib/contact-create";
import { NextResponse } from "next/server";

/** Prisma и @generated/client рассчитаны на Node, не на Edge. */
export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Некорректное тело запроса" }, { status: 400 });
  }

  try {
    const result = await createContactRequest(body);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }
    return NextResponse.json({ id: result.id, ok: true }, { status: 201 });
  } catch (err) {
    console.error("[api/contact]", err);
    return NextResponse.json({ error: "Не удалось сохранить заявку" }, { status: 500 });
  }
}
