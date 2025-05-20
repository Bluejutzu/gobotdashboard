import { ErrorPage } from "@/components/error-page"  

/**
 * Displays a Minecraft-themed 404 error page with a custom message and UI elements.
 *
 * @returns A React element representing the customized not found page.
 */
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
