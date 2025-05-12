import { ErrorPage } from "@/components/error-page"  

export default function CatchAllNotFound() {
    return (
        <ErrorPage
            statusCode={404}
            minecraftStyle={true}
            showSearch={false}
            showPixelCharacter={true}
            footerText="You died! Score: 0"
        />
    )
}
