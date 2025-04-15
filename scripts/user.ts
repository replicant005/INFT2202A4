

/**
 * Interface defining the shape of user data received from API/storage
 */
export interface IUserData {
    DisplayName: string;
    EmailAddress: string;
    Username: string;
    Password?: string; // Optional - not always included for security
}

/**
 * User class represents a user with basic properties like display name, email, username, and password.
 */
export class User {
    private _displayName: string;
    private _emailAddress: string;
    private _userName: string;
    private _password: string;

    /**
     * Creates a new User instance
     * @param displayName User's display name
     * @param emailAddress User's email address
     * @param userName User's username
     * @param password User's password (optional)
     */
    constructor(
        displayName: string = "",
        emailAddress: string = "",
        userName: string = "",
        password: string = ""
    ) {
        this._displayName = displayName;
        this._emailAddress = emailAddress;
        this._userName = userName;
        this._password = password;
    }

    // Getters
    get displayName(): string {
        return this._displayName;
    }

    get emailAddress(): string {
        return this._emailAddress;
    }

    get userName(): string {
        return this._userName;
    }

    // Setters
    set displayName(displayName: string) {
        this._displayName = displayName;
    }

    set emailAddress(emailAddress: string) {
        this._emailAddress = emailAddress;
    }

    set userName(userName: string) {
        this._userName = userName;
    }

    /**
     * Converts the user object to a string representation.
     * @returns A string describing the user with display name, email address, and username.
     */
    toString(): string {
        return `Display Name: ${this.displayName}\nEmail Address: ${this.emailAddress}\nUser Name: ${this.userName}`;
    }

    /**
     * Serializes the user object to a string.
     * @returns A string with display name, username, and email address, or null if properties are missing.
     */
    serialize(): string | null {
        if (this._displayName !== "" && this._emailAddress !== "" && this._userName !== "") {
            return `${this.displayName},${this._userName},${this.emailAddress}`;
        }
        console.error("[ERROR] Serialization failed! One or more user properties are missing.");
        return null;
    }

    /**
     * Deserializes a string into a user object.
     * @param data A serialized string containing display name, username, and email address.
     */
    deserialize(data: string): void {
        const propertyArray = data.split(",");
        this._displayName = propertyArray[0];
        this._emailAddress = propertyArray[1];
        this._userName = propertyArray[2];
    }

    /**
     * Converts the user object to a JSON object.
     * @returns A JSON object representing the user with display name, email address, username, and password.
     */
    toJSON(): IUserData {
        return {
            DisplayName: this._displayName,
            EmailAddress: this._emailAddress,
            Username: this._userName,
            Password: this._password,
        };
    }

    /**
     * Populates the user object from a JSON object.
     * @param data A JSON object with user properties: DisplayName, EmailAddress, UserName, Password.
     */
    fromJSON(data: IUserData): void {
        this._displayName = data.DisplayName;
        this._emailAddress = data.EmailAddress;
        this._userName = data.Username;
        this._password = data.Password || "";
    }
}

export default User;