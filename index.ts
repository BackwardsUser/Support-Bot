// StyLiS Studios' Discord Support Bot - Improved
// BackwardsUser

// This project is NOT endorsed by StyLiS Studios and is in no way Official.
// This project is just something I felt like throwing together because their bot stinks, feels like emails on discord.

import { GatewayIntentBits, Client, Partials, Events, Message, Embed, EmbedBuilder, EmbedAuthorData, ColorResolvable } from "discord.js";
import { get, request, RequestOptions } from "node:https";
import jsonBody from "body/json";

var newIntents: GatewayIntentBits[] = [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
]

var newPartials: Partials[] = [
    Partials.Channel,
    Partials.Message
]

var client: Client = new Client({
    intents: newIntents,
    partials: newPartials
});

client.once(Events.ClientReady, () => {
    console.log(`Successfully Logged in as ${client.user?.tag}!`);
})

interface uInfo {
    Category: "account" | "moderation" | "bug" | "other" | undefined,
    RobloxUsername?: string,
}

interface sUser {
    userID: string,
    position: number,
    information: uInfo
}

var supportingUsers: sUser[] = []

var defaultAuthor: EmbedAuthorData = {
    name: "StyLIS Support & Inquiry",
    url: "https://stylis-studios.com/",
    iconURL: undefined
}

class defaultEmbed extends EmbedBuilder {
    constructor(description: string, color: ColorResolvable, doDefaultAuthor: boolean, title?: string, link?: string) {
        super();
        this.setDescription(description);
        this.setColor(color);
        if (title && title !== "") this.setTitle(title);
        if (link && link !== "") this.setURL(link);
        if (doDefaultAuthor) this.setAuthor(defaultAuthor);
    };
};

var br = "\n";

function sendSupportMessage(msg: Message) {
    var supportMessage: string = "Hello, you are in the process of creating an inquiry/support ticket with us!" +
        br + br +
        "We need to know what category your inquiry falls under, please answer with one of the following:" +
        br +
        "`account`, `moderation`, `bug`, or `other`" +
        br + br +
        "**Descriptions**:" +
        br +
        "**• Account**: Account issues, including lost purchases, data, or other issues with your Phantom Forces player)" +
        br +
        "**• Bug**: For reporting bugs or exploits in the game." +
        br +
        "**• Moderation**: Anything related to in-game moderation, like **bans**, or **reporting**" +
        br +
        "**• Other**: Anything that does not fit in the above categories." +
        br + br +
        "**Which category do you wish support for?** *Just Reply*";

    var supportEmbed = new defaultEmbed(supportMessage, "#444488", true);
    msg.reply({ embeds: [supportEmbed] })
}

function supportNeeded(msg: Message, currentUser: sUser) {
    sendSupportMessage(msg)
    currentUser.position++
}

function firstReply(msg: Message, currentUser: sUser) {
    switch (msg.content) {
        case "account":
            currentUser.information.Category = "account";
            account(msg, currentUser);
            break;
        case "moderation":
            currentUser.information.Category = "moderation";
            moderation(msg, currentUser);
            break;
        case "bug":
            currentUser.information.Category = "bug";
            bug(msg, currentUser);
            break;
        case "other":
            currentUser.information.Category = "other";
            // other(msg, currentUser);
            break;
        default:
            msg.reply(`Invalid Response: \`${msg.content}\`.`);
            supportNeeded(msg, currentUser);
            currentUser.position = 0;
            break;
    }
    currentUser.position++;
}

function account(msg: Message, currentUser: sUser) {
    var accountString: string = "**Account Support**" +
        br +
        "Please note that it may take some time to get things sorted out so please be patient." +
        br + br +
        "If you have not encountered any of the following, please enter the correct category: (Enter \"categories\" to see the first menu)" +
        br +
        "• Any purchase related issues." +
        br +
        "• Any loss of data, including ranks, credits, guns, etc." +
        br + br +
        "• Issues with your player like class spawn issues, etc." +
        br + br +
        "**Is this the correct category?** (yes/no)";
    msg.reply({ embeds: [new defaultEmbed(accountString, "#880000", false)] });
}

function moderation(msg: Message, currentUser: sUser) {
    var moderationString: string = "**Moderation Support**" +
        br +
        "Please note that it may take some time to get things sorted out so please be patient." +
        br + br +
        "If you have not encountered any of the following, please enter the correct category: (Enter \"categories\" to see the first menu)" +
        br +
        "• Appealing your account that was banned/moderated in any way." +
        br +
        "• Inquiring about Moderation against your account." +
        br + br +
        "**Is this the correct category?** (yes/no)";
    msg.reply({ embeds: [new defaultEmbed(moderationString, "#880000", false)] });
}

function bug(msg: Message, currentUser: sUser) {
    var bugString: string = "**Bug Report**" +
        br + br +
        "If you have not encountered any of the following, please enter the correct category: (Enter \"categories\" to see the first menu)" +
        br +
        "• A bug you'd like to report." +
        br +
        "• An exploit you'd like to report." +
        br + br +
        "**Is this the correct category?** (yes/no)";
    msg.reply({ embeds: [new defaultEmbed(bugString, "#880000", false)] });
}

function other(msg: Message, currentUser: sUser) {
    var otherString: string = "**Other Inquiry**" +
        br +
        "Your ticket doesn't fall under any of the other categories. However, here is what this category is usually used for:" +
        br + br +
        "If you have not encountered any of the following, please enter the correct category: (Enter \"categories\" to see the first menu)" +
        br +
        "• Sponsorships. (Sponsoring your Youtube Channel, Twitch Channel, etc.)." +
        br +
        "• Business Inquiries of any sort. (Offers, Partnerships, etc.)" +
        br +
        "• Any other type of questions! (Keep it professional)" +
        br + br +
        "**Is this the correct category?** (yes/no)";
    msg.reply({ embeds: [new defaultEmbed(otherString, "#880000", false)] });
}

function secondReply(msg: Message, currentUser: sUser) {
    if (currentUser.information.Category == "account" || currentUser.information.Category == "moderation") robloxAccountNeeded(msg, currentUser);
    else {
        // Do stuff for other two options
    }
}

function robloxAccountNeeded(msg: Message, currentUser: sUser) {
    var accNeededString: string = "Your roblox account is required in order to submit an `account` or `moderation` support request." +
        br + br +
        "**Please enter your Roblox Username.**";
    msg.reply({ embeds: [new defaultEmbed(accNeededString, "#880000", false)] });
    currentUser.position++
}

interface robloxUserData {
    previousUsernames: string[],
    hasVerifiedBadge: boolean,
    id: number,
    name: string,
    displayName: string,
    description: string
}

interface userAPIReq {
    previousPageCursor: string | null,
    nextPageCursor: string | null,
    data: robloxUserData[]
}

async function getRobloxUser(msg: Message, currentUser: sUser) {

    // My Beautiful birds nest :)

    get(`https://users.roblox.com/v1/users/search?keyword=${msg.content.toLowerCase()}&limit=10`, res => {
        if (res.statusCode !== 200) return console.log("Something went wrong: Status Code " + res.statusCode + ".\n" + res.statusMessage);
        var bArray: Buffer[] = [];
        var body: string = "";
        res.on("data", chunk => {
            bArray.push(chunk);
        }).on("end", () => {
            body = Buffer.concat(bArray).toString();
            var bodyObj: userAPIReq = JSON.parse(body);
            var localUser: robloxUserData = bodyObj.data[0];
            get(`https://friends.roblox.com/v1/users/${localUser.id}/friends/count`, (res) => {
                bArray = []
                res.on("data", chunk => {
                    bArray.push(chunk)
                }).on("end", () => {
                    body = Buffer.concat(bArray).toString();
                    var friendsCount = JSON.parse(body).count;
                    get(`https://friends.roblox.com/v1/users/${localUser.id}/followers/count`, (res) => {
                        bArray = []
                        res.on("data", chunk => {
                            bArray.push(chunk)
                        }).on("end", () => {
                            body = Buffer.concat(bArray).toString();
                            var followersC = JSON.parse(body).count;
                            get(`https://friends.roblox.com/v1/users/${localUser.id}/followings/count`, (res) => {
                                bArray = []
                                res.on("data", chunk => {
                                    bArray.push(chunk)
                                }).on("end", () => {
                                    body = Buffer.concat(bArray).toString();
                                    var followingsC = JSON.parse(body).count;
                                    
                                    var userTitle = localUser.name;
                                    var userURL = `https://roblox.com/users/${localUser.id}/profile/`;
                                    var userString = "**Friends**: " + ((friendsCount) ? friendsCount : 0) +
                                    ", **Followers**: " + ((followersC) ? followersC : 0) +
                                    ", **Following**: " + ((followingsC)? followingsC : 0) +
                                    br +
                                    "**Last 3 Usernames**: " + ((localUser.previousUsernames[0] == undefined) ? "N/A" : localUser.previousUsernames[0] + ((localUser.previousUsernames[1] == undefined) ? "N/A" : localUser.previousUsernames[1] + ((localUser.previousUsernames[2] == undefined) ? "N/A" : localUser.previousUsernames[2]))) +
                                    br +
                                    "**Bio**: " + ((localUser.description == undefined) ? "No Bio Set..." : localUser.description) +
                                    br + br +
                                    "**Is this the correct account?** (yes/no)"
                                    console.log(localUser)
                                    msg.reply({embeds: [new defaultEmbed(userString, "#FF0000", false, userTitle, userURL)]})
                                })
                            })
                        })
                    })
                })
            })
        })
    })
}

client.on(Events.MessageCreate, (msg: Message) => {
    if (!msg.channel.isDMBased() || msg.author.bot) return;
    if (msg.content == "categories") return sendSupportMessage(msg)
    var currentUserIndex: number = supportingUsers.findIndex(users => users.userID === msg.author.id);
    if (currentUserIndex == -1) {
        supportingUsers.push({
            userID: msg.author.id,
            position: 0,
            information: {
                Category: undefined
            }
        });

        // As we've just created a new Element we COULD assume its the newest (last) element in the array,
        // However doing that could cause the user to get another users position if created at the same time as another user.
        // Not a big deal, but its better to just do this.
        currentUserIndex = supportingUsers.findIndex(users => users.userID === msg.author.id);
    };
    var currentUser: sUser = supportingUsers[currentUserIndex];
    var legalResponses: string[] = ["account", "moderation", "bug", "other"];
    if ((currentUser.position == 1 || currentUser.position == 0) && legalResponses.includes(msg.content.toLowerCase())) currentUser.position = 1;
    console.log(currentUser.position)
    switch (currentUser.position) {
        case 0:
            supportNeeded(msg, currentUser);
            break;
        case 1:
            firstReply(msg, currentUser);
            break;
        case 2:
            if (msg.content == "yes") secondReply(msg, currentUser);
            else if (msg.content == "no") {
                currentUser.position = 1;
                supportNeeded(msg, currentUser);
            }
            break;
        case 3:
            if (currentUser.information.Category == "account" || currentUser.information.Category == "moderation") {
                getRobloxUser(msg, currentUser);
            } else {

            }
            break;
    }
})

client.login("Tokem Herem")