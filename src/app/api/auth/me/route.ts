import { NextRequest } from "next/server";
import { requireAuth } from "@/server/utils/auth-guard";
import { AuthService } from "@/server/modules/auth/auth.service";
import { apiSuccess, handleRouteError } from "@/server/utils/response";

export async function GET(req: NextRequest) {
  try {
    const { session } = await requireAuth(req);
    const user = await AuthService.getCurrentUser(session.userId);

    return apiSuccess({ user });
  } catch (err) {
    return handleRouteError(err);
  }
}
