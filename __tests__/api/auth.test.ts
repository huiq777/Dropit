import { POST, GET, DELETE } from "@/app/api/auth/route";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Mock environment variables
process.env.JWT_SECRET = "test-secret";
process.env.APP_PASSWORD = "test-password";

// Mock dependencies
jest.mock("jsonwebtoken");
jest.mock("bcryptjs");

const mockJwt = jwt as jest.Mocked<typeof jwt>;
const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe("/api/auth", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/auth", () => {
    it("returns 400 for missing password", async () => {
      const request = new NextRequest("http://localhost/api/auth", {
        method: "POST",
        body: JSON.stringify({}),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("密码不能为空");
    });

    it("returns 401 for invalid password", async () => {
      mockBcrypt.hash.mockResolvedValue("hashed-password" as never);
      mockBcrypt.compare.mockResolvedValue(false as never);

      const request = new NextRequest("http://localhost/api/auth", {
        method: "POST",
        body: JSON.stringify({ password: "wrong-password" }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("密码错误");
    });

    it("returns 200 for valid password", async () => {
      mockBcrypt.hash.mockResolvedValue("hashed-password" as never);
      mockBcrypt.compare.mockResolvedValue(true as never);
      mockJwt.sign.mockReturnValue("fake-jwt-token" as never);

      const request = new NextRequest("http://localhost/api/auth", {
        method: "POST",
        body: JSON.stringify({ password: "test-password" }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe("登录成功");

      // Check that JWT token was generated
      expect(mockJwt.sign).toHaveBeenCalledWith(
        { authenticated: true },
        "test-secret",
        { expiresIn: "24h" },
      );

      // Check that cookie was set
      const setCookieHeader = response.headers.get("Set-Cookie");
      expect(setCookieHeader).toContain("auth-token=fake-jwt-token");
    });

    it("handles bcrypt errors", async () => {
      mockBcrypt.hash.mockRejectedValue(new Error("Bcrypt error") as never);

      const request = new NextRequest("http://localhost/api/auth", {
        method: "POST",
        body: JSON.stringify({ password: "test-password" }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("服务器错误");
    });
  });

  describe("GET /api/auth", () => {
    it("returns 401 for missing token", async () => {
      const request = new NextRequest("http://localhost/api/auth", {
        method: "GET",
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.authenticated).toBe(false);
    });

    it("returns 401 for invalid token", async () => {
      mockJwt.verify.mockImplementation(() => {
        throw new Error("Invalid token");
      });

      const request = new NextRequest("http://localhost/api/auth", {
        method: "GET",
        headers: {
          Cookie: "auth-token=invalid-token",
        },
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.authenticated).toBe(false);
    });

    it("returns 200 for valid token", async () => {
      mockJwt.verify.mockReturnValue({ authenticated: true } as never);

      const request = new NextRequest("http://localhost/api/auth", {
        method: "GET",
        headers: {
          Cookie: "auth-token=valid-token",
        },
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.authenticated).toBe(true);
    });
  });

  describe("DELETE /api/auth", () => {
    it("returns 200 and clears cookie", async () => {
      const request = new NextRequest("http://localhost/api/auth", {
        method: "DELETE",
      });

      const response = await DELETE(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe("登出成功");

      // Check that cookie was cleared
      const setCookieHeader = response.headers.get("Set-Cookie");
      expect(setCookieHeader).toContain("auth-token=;");
      expect(setCookieHeader).toContain("Max-Age=0");
    });
  });
});
