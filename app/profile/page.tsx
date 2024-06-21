

export default async function Index() {

    return <div>
        <h1>Profile Page</h1>
        <form>
            <label htmlFor="email">Email</label>
            <input type="email" name="email" />
            <label htmlFor="firstName">First Name</label>
            <input type="text" name="firstName" />
            <label htmlFor="lastName">Last Name</label>
            <input type="text" name="lastName" />
            <label htmlFor="avatar">Avatar</label>
            <input type="file" name="avatar" />
        </form>
    </div>
}