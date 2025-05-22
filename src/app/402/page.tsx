import { ErrorPage } from "@/components/error-page";

export default function PaymentRequiredPage() {
    return <ErrorPage statusCode={402} />;
}
