import { createProtectedRouter } from "./protected-router";
import { z } from "zod";

export const petRouter = createProtectedRouter()
  .query("hello", {
    input: z
      .object({
        text: z.string().nullish(),
      })
      .nullish(),
    resolve({ input }) {
      return {
        greeting: `Hello ${input?.text ?? "world"}`,
      };
    },
  })
  .query("getPets", {
    async resolve({ ctx }) {
      return await ctx.prisma.pet.findMany({
        orderBy: [
          {
            updatedAt: 'desc',
          },
        ],
        where: {
          userId: ctx.session?.user?.id
        }
      });
    },
  })
  .mutation("createPet", {
      input: z.object({
        name: z.string(),
      }),
      async resolve({ input, ctx }) {
        const pet = await ctx.prisma.pet.create({
          data: {...input, owner: {
            connect: {
              id: ctx.session?.user?.id
            }
          } }
        });
        return pet;
      },
  })
  .mutation("removePet", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input, ctx }) {
      const pet = await ctx.prisma.pet.delete({
         where: input
      });
      return pet;
    },
});
