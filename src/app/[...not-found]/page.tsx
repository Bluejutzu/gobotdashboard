import { ErrorPage } from "@/components/error-page"  

/**
 * Displays a Minecraft-themed 404 error page with a custom message and UI elements.
 *
 * Renders an error page indicating that the requested resource was not found, styled to resemble a Minecraft game over screen.
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
