import prisma from "../prisma";

export async function listProducts(){
    return prisma.products.findMany({ orderBy: { createdAt: "desc" }})
}