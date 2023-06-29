const groupDetails = (details, editing) => {
    const groupedDetails = {};

    details.forEach((detail) => {
        // for each detail, split its name into its group (such as "Cake Tier #0") and property
        const splitName = detail.fieldName.split(" -- ");
        const groupName = splitName[0];
        
        let propertyName;
        if (!editing) {
            propertyName = splitName[1];
        } else {
            propertyName = splitName[1] + " -- " + detail.orderDetailFieldId;
        }
        const propertyValue = detail.fieldValue;

        // add the group to the groupedDetails object if it doesn't exist with the new property
        if (!(groupName in groupedDetails)) {
            groupedDetails[groupName] = { [propertyName]: propertyValue };
        } else {
            // otherwise, add the property to the group
            groupedDetails[groupName][propertyName] = propertyValue;
        }
    });

    return groupedDetails;
};

export default groupDetails;