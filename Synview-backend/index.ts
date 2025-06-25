import { serve } from "https://deno.land/std@0.140.0/http/server.ts";
import { withAccelerate } from "npm:@prisma/extension-accelerate";
import { PrismaClient } from './generated/prisma/client.ts';

const prisma = new PrismaClient().$extends(withAccelerate());