const fs = require('fs');
const input_dir = './inputs/' //change the origin folder here
const output_dir = './outputs/';
if (!fs.existsSync(output_dir)) fs.mkdirSync(output_dir);

fs.readdir(input_dir, (err, files) => { //read all the files in the directory
    if (err) {
        throw new Error('could not read the directory');
        return
    }
    files.forEach(file => {
        // Checking that the file is an .h2k file
        let name_length = file.length
        if (file.slice(name_length - 4, name_length) != '.h2k') return

        console.log(`Reading ${file}`);
        let read = fs.readFileSync(input_dir + file);
        read = read.toString();
        let anon = anonymize(read);
        fs.writeFileSync(`${output_dir}a_${file}`, anon)
    });
})

function anonymize(xml) {
    //Step 1: Find the necessary values
    let ownership = getTagCode(xml, 'Ownership');
    let province = getTagInnerData(xml, 'Province');
    let province_code = getTagCode(xml, 'Province'); //Some versions have province code
    let city = getTagInnerData(xml, 'City');
    let postal = getTagInnerData(xml, 'PostalCode');
    postal = postal.slice(0, 3); //only the first three true characters of the postal code
    if (postal.length) postal += '9X9' // 9X9 is added to the postal code above because HOT2000 errors if the Postal code is incomplete


    //Step 2: Fill in the blank templates
    let new_File = writeFile(ownership);
    let new_Client = writeClient(postal, province, city, province_code);

    //Step 3: Replace the old with the new
    let old_File = getTagInnerData(xml, 'File'); //Indexes of the old "File" tag
    let old_Client = getTagInnerData(xml, 'Client');
    xml = xml.replace(old_File, new_File);
    xml = xml.replace(old_Client, new_Client);

    return xml
}

function writeFile(ownership) {
    return `
        <Identification></Identification>
        <PreviousFileId></PreviousFileId>
        <EnrollmentId></EnrollmentId>
        <Ownership code="${ownership}">
        </Ownership>
        <TaxNumber></TaxNumber>
        <EnteredBy></EnteredBy>
        <Company></Company>
        <BuilderName></BuilderName>
    `
}

function writeClient(postal, province, city, province_code) {
    return `
    <Name>
    <First></First>
    <Last></Last>
    </Name>
    <Telephone></Telephone>
    <StreetAddress>
        <Street>Redacted by StepWin h2kAnonymizer</Street>
        <City>${city}</City>
        <Province ${province_code? 'code='+province_code : '' } >
            ${province}
        </Province>
        <PostalCode>${postal}</PostalCode>
    </StreetAddress>
    <MailingAddress>
        <Name></Name>
        <Street>Last 3 postal code characters redacted</Street>
        <City>${city}</City>
        <Province>${province}</Province>
        <PostalCode>${postal}</PostalCode>
    </MailingAddress>
    `
}

function getTagInnerData(xml, tag) { //returns whatever is wrapped in an xml tag
    let indexes = findTagInnerIndexes(xml, tag);
    if (indexes.self_closing) return "";
    return xml.slice(indexes.start, indexes.end);
}

function findTagInnerIndexes(xml, tag) { //CAUTION: Case-sensitive
    // console.log('doing tag', tag);
    let opening = xml.indexOf(`<${tag}`);
    let start = xml.indexOf('>', opening) + 1; //find the ">" after the opening of the tag
    let end = xml.indexOf(`</${tag}`);
    let self_closing = end === -1 ? true : false;
    if (start > end && !self_closing) throw new Error(' File is possibly corrupt ');
    return {
        start,
        end,
        self_closing
    }
}

function getTagCode(xml, tag) {
    let identifier = `<${tag} code="`
    let start = xml.indexOf(identifier) + identifier.length;
    let end = xml.indexOf('"', start)
    return xml.slice(start, end)
}