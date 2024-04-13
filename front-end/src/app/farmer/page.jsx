"use client"

import { useSignerContext } from "@/context";

export default function Farmer() {
    const { signer, setSigner } = useSignerContext();
    return (<h1>Hello Farmer</h1>)
}