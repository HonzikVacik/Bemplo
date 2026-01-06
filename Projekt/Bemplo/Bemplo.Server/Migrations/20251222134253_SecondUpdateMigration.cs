using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Bemplo.Server.Migrations
{
    /// <inheritdoc />
    public partial class SecondUpdateMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "SenderId",
                table: "Chats",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "OriginalExperienceId",
                table: "Experiences",
                type: "integer",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SenderId",
                table: "Chats");

            migrationBuilder.DropColumn(
                name: "OriginalExperienceId",
                table: "Experiences");
        }
    }
}
