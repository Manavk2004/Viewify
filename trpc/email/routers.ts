// server/api/routers/email.ts
import { z } from "zod";
import { baseProcedure, createTRPCRouter, } from "../init";
import { Resend } from "resend";
import Mailgun from "mailgun.js"
import FormData from "form-data";


export const emailRouter = createTRPCRouter({
  sendWelcome: baseProcedure
    .input(
      z.object({
        to: z.email(),
        firstName: z.string().min(1).max(50),
      })
    )
    .mutation(async ({ input }) => {
        const mailgun = new Mailgun(FormData)
        const mg = mailgun.client({
            username: "api",
            key: process.env.API_KEY || ""
        })

        try{
            const data = await mg.messages.create("sandboxaf84ce9dd9304fb8b65a27070bdb9d39.mailgun.org", {
                from: "Mailgun Sandbox <postmaster@sandboxaf84ce9dd9304fb8b65a27070bdb9d39.mailgun.org>",
                to: ["Manav Kamdar <mjkamdar04@gmail.com>"],
                subject: "Hello Manav Kamdar",
                text: "Congratulations Manav Kamdar, you just sent an email with Mailgun! You are truly awesome!"
            })

            console.log(data)
        }catch(err){
            console.log(err)
        }
    }),
});      
