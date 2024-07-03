export type FrameWork = {
    value: string;
    label: string;
    available: boolean;
    template?: string;
};

export const frameworks: FrameWork[] = [
    { value: "empty", label: "Empty", available: true, template: "" },
    { value: "github", label: "GitHub", available: false, template: "" },
    {
        value: "node.js",
        label: "Node.js",
        available: true,
        template: "nodejs-base",
    },
    { value: "react", label: "React", available: true, template: "vite-react" },
    {
        value: "next.js",
        label: "Next.js",
        available: false,
        template: "nextjs-base",
    },
    { value: "cpp", label: "C++", available: true, template: "cpp-base" },
    { value: "rust", label: "Rust", available: true, template: "rust-base" },
    { value: "go", label: "Go", available: false, template: "" },
    {
        value: "python",
        label: "Python",
        available: true,
        template: "python-base",
    },
] as const;