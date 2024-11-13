"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useCart } from "../cart/cart-context";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ApiResponse } from "@/types/api";
import { Account } from "@/types/frontend/entities";
import { api } from "@/service/api";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

const fetchAccountByEmail = async(email: string) : Promise<ApiResponse<Account>> => {
    return api.get<Account>(`accounts/${email}/info`)
}

const formSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(10, "Phone number is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  postalCode: z.string().min(5, "Postal code is required"),
  paymentMethod: z.enum(["COD", "VNPay", "PayPal"]),
});

export function CheckoutForm() {
  const { items, total, clearCart } = useCart();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: session } = useSession()

  const accountQuery = useQuery({
    queryKey: ['account', session?.user.email],
    queryFn: () => fetchAccountByEmail(session?.user.email || ''),
    enabled: !!session?.user.email
  })

  const account = accountQuery.data?.data

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: account?.userName || "",
      email: account?.email || "",
      phoneNumber: account?.phoneNumber || "",
      address: account?.address || "",
      city: "",
      postalCode: "",
      paymentMethod: "COD",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsProcessing(true);
    try {
      // Simulate API call to process the order
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("Order processed:", { ...values, items, total });
      clearCart();
      toast.success("Order placed successfully!");
      router.push("/order-confirmation");
    } catch (error) {
      console.error("Error processing order:", error);
      toast.error("Failed to process order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-8xl mx-auto p-6">
      {items.length > 0 ? (
        <>
          <Form {...form}>
            <h1 className="text-3xl font-bold mb-6">Checkout</h1>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-xl font-semibold mb-4">
                    Shipping and Payment
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="john@example.com"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="+84 123 456 789" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Input placeholder="123 Main St" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="Ho Chi Minh City" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="postalCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Postal Code</FormLabel>
                            <FormControl>
                              <Input placeholder="70000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Method</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex items-center space-x-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="COD" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Cash on Delivery (COD)
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="VNPay" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                VNPay
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="PayPal" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                PayPal
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <h3 className="text-[24px] font-semibold my-4">Items:</h3>
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center mb-2 mt-4"
                    >
                      <span>
                        {item.name} x {item.quantity}
                      </span>
                      <span>
                        {(item.price * item.quantity).toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </span>
                    </div>
                  ))}
                  <Separator className="my-4" />
                  <div className="text-xl text-right font-bold mt-4 mb-4">
                    Total:{" "}
                    {total.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </div>
                  <div className="flex items-center gap-4">
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isProcessing}
                      >
                        {isProcessing ? "Processing..." : "Place Order"}
                      </Button>
                      <Button onClick={() => router.push('/')} variant={'secondary'} className="w-full">
                        Cancel
                      </Button>
                  </div>
                </div>
              </div>
            </form>
          </Form>
        </>
      ) : (
        <div className="flex flex-col justify-center">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/intericoffee-442da.appspot.com/o/pngwing.com.png?alt=media&token=d447744e-87fb-4834-bb1f-13bdbdf3e821"
            alt="Empty Cart"
            className="w-[480px] h-auto object-cover"
          />
          <span>
            <p className="w-full text-center">
              Your cart empty! Cannot checkout
            </p>
            <p className="w-full text-center">
              Please add some items to cart before continue
            </p>
          </span>
        </div>
      )}
    </div>
  );
}
