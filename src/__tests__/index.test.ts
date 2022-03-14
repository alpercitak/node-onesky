import { OneSky } from "../index";
const onesky = new OneSky({ PUBLIC_KEY: "PUBLIC_KEY", SECRET_KEY: "SECRET_KEY" });

const endpoints = {
    files: 3,
    locales: 1,
    orders: 3,
    project_groups: 5,
    project_types: 1,
    projects: 6,
    quotations: 1,
    tasks: 2,
    translations: 4
};
test("files", async () => {
    expect(Object.keys(onesky.files).length).toEqual(endpoints.files);
});
test("locales", () => {
    expect(Object.keys(onesky.locales).length).toEqual(endpoints.locales);
});
test("orders", () => {
    expect(Object.keys(onesky.orders).length).toEqual(endpoints.orders);
});
test("project_groups", () => {
    expect(Object.keys(onesky.project_groups).length).toEqual(endpoints.project_groups);
});
test("project_types", () => {
    expect(Object.keys(onesky.project_types).length).toEqual(endpoints.project_types);
});
test("projects", () => {
    expect(Object.keys(onesky.projects).length).toEqual(endpoints.projects);
});
test("quotations", () => {
    expect(Object.keys(onesky.quotations).length).toEqual(endpoints.quotations);
});
test("tasks", () => {
    expect(Object.keys(onesky.tasks).length).toEqual(endpoints.tasks);
});
test("translations", () => {
    expect(Object.keys(onesky.translations).length).toEqual(endpoints.translations);
});