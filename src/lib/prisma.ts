import { PrismaClient } from "@prisma/client";

const PrismaClientSingleton = () => {
    return new PrismaClient();
}

declare global {
    var prismaGlobal: undefined | ReturnType<typeof PrismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? PrismaClientSingleton();

export default prisma;

if(process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma; 





// import { PrismaClient } from '@prisma/client'

// const prismaClientSingleton = () => {
//   return new PrismaClient()
// }

// declare const globalThis: {
//   prismaGlobal: ReturnType<typeof prismaClientSingleton>;
// } & typeof global;

// const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

// export default prisma

// if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma