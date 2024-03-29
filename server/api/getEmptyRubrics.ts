export default defineEventHandler(async (event) => {
    try {
        const res = await fetch(
            "https://www.klerk.ru/yindex.php/v3/event/rubrics?allowEmpty=1"
        )
        const data = await res.json()
        return data
    } catch (error) {
        console.error("API call failed:", error)
        return "Internal Server Error: " + error
    }
})
