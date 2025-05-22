import { ErrorPage } from "@/components/error-page";

/**
 * Displays a custom Minecraft-themed 404 error page with a "You died! Score: 0" footer.
 *
 * Renders the {@link ErrorPage} component with specific props to create a distinctive not found experience.
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
    );
}
