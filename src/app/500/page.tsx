import { ErrorPage } from "@/components/error-page"

export default function InternalServerErrorPage() {
    return <ErrorPage statusCode={500} />
}
