declare module "prismjs" {
    const Prism: {
        highlightAll: () => void;
        highlight: (text: string, grammar: any, language: string) => string;
        languages: {
            [key: string]: any;
        };
    };
    export default Prism;
}
