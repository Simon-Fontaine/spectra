"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function NotFoundPage() {
  const router = useRouter();

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <motion.div
        className="text-center space-y-6 max-w-md mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* 404 Number */}
        <motion.h1
          className="text-[8rem] md:text-[10rem] font-extrabold leading-none bg-clip-text text-transparent bg-gradient-to-b from-primary/80 to-primary/20"
          variants={itemVariants}
        >
          404
        </motion.h1>

        {/* Heading and Description */}
        <motion.div className="space-y-4" variants={itemVariants}>
          <h2 className="font-heading text-2xl md:text-3xl font-bold tracking-tight">
            Something&apos;s missing
          </h2>
          <p className="text-muted-foreground max-w-sm mx-auto">
            Sorry, the page you are looking for doesn&apos;t exist or has been
            moved.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          variants={itemVariants}
        >
          <Button
            onClick={() => router.back()}
            variant="default"
            size="lg"
            className="w-full sm:w-auto group relative overflow-hidden"
          >
            <Icons.chevronLeft className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
            Go back
          </Button>
          <Button
            onClick={() => router.push("/")}
            size="lg"
            variant="ghost"
            className="w-full sm:w-auto group hover:bg-transparent"
          >
            <span className="relative group-hover:text-foreground transition-colors">
              Back to Home
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-foreground origin-left transform scale-x-0 transition-transform group-hover:scale-x-100" />
            </span>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
