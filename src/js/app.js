(function() {
    const APP_ID = 5801213; // put your app_id here
    const P_KEY = "kZ2dI8so0pih16gEnpLy"; // put your private key here
    window.VK && VK.init({
        apiId: APP_ID
    });

    VK.Auth.login(startApp);

    function startApp(uData) {
        let vkUsers = [],
            csvUsers = [];

        document.getElementById("getUsersBtn").addEventListener("click", getVKUsers);
        document.getElementById("uploadCSV").addEventListener("change", uploadMultipleCSV);
        document.getElementById("compareBtn").addEventListener("click", compareUsers);

        function compareUsers() {
            let resUsersListNode = document.getElementById("resUsersList"),
                resArr = [];
            document.getElementById("resList").innerHTML = "";

            csvUsers.forEach(file => {
                let res = [];
                file.users.forEach(csvUserId => {
                    if(vkUsers.indexOf(csvUserId) === -1)
                        res.push(csvUserId);
                });

                resArr.push({
                    name: file.name,
                    res: res
                });

                let pct = Math.round((res.length / file.users.length) * 100);
                let fileResEl = document.createElement("div");
                fileResEl.appendChild(document.createTextNode(`${file.name} - ${res.length} - ${pct}%`));
                document.getElementById("resList").appendChild(fileResEl);
            });
        }

        function uploadMultipleCSV(evt) {
            csvUsers = [];
            document.getElementById("csvList").innerHTML = "";

            for(let i = 0; i < this.files.length; i++) {
                let file = this.files[i],
                    reader = new FileReader();
                reader.readAsBinaryString(this.files[i]);

                reader.onload = function(event) {
                    let res = Papa.parse(event.target.result);
                    if(res.data && res.data.length) {
                        let users = [];
                        res.data.forEach((link) => {
                            if(link[2]) {
                                let id = +link[2].split("id")[1];
                                if(id)
                                    users.push(id);
                            }
                        });

                        csvUsers.push({
                            name: file.name,
                            users: users || []
                        });

                        let cntEl = document.createElement("div");
                        cntEl.appendChild(document.createTextNode(`${file.name} - ${users.length}`));
                        document.getElementById("csvList").appendChild(cntEl);
                    }
                }
            }
        }

        function getVKUsers() {
            let count = 1000,
                usersListNode = document.getElementById("usersList");

            usersListNode.innerHTML = "";
            vkUsers = [];

            VK.api("groups.getMembers",
                {
                    group_id: "72264719",
                    sort: "id_asc",
                    offset: 0,
                    count: count
                },
                mData => {
                vkUsers.push(...mData.response.users);
            mData.response.users.forEach(userId => {
                let el = document.createElement("div");
            el.appendChild(document.createTextNode(userId))
            usersListNode.appendChild(el);
        });
            for(let i = 1; i <= Math.floor(mData.response.count / count); i++) {
                VK.api("groups.getMembers",
                    {
                        group_id: "72264719",
                        sort: "id_asc",
                        offset: 1000 * i,
                        count: 1000
                    },
                    mData => {
                    vkUsers.push(...mData.response.users);
                mData.response.users.forEach(userId => {
                    let el = document.createElement("div");
                el.appendChild(document.createTextNode(userId))
                usersListNode.appendChild(el);
            });
                document.getElementById("vkCntNode").innerHTML = `(${vkUsers.length})`;
            });
            }
        });

        }
    }
})();

