const { Project, Query, Template } = require("../models");

const createQueryFromTemplate = async (project, template_id) => {
  // find template from ID
  // deal with error if not found ?

  const template = await Template.findOne({ where: { id: template_id } });
  if (!template) {
    return { error: "No template found" };
  }

  //create query with template info
  // and return

  const newQuery = await Query.create({
    name: `Query from template: ${template.name}`,
    link: template.link,
    p_key: template.primary_key,
    project_id: project.id,
    template_id: template.id,
  });

  return newQuery;
};

module.exports = { createQueryFromTemplate };
