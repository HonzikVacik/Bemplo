using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Bemplo.Server.Migrations
{
    /// <inheritdoc />
    public partial class ThirdUpdateMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FileName",
                table: "Pictures");

            migrationBuilder.DropColumn(
                name: "Size",
                table: "Pictures");

            migrationBuilder.AddColumn<int>(
                name: "Order",
                table: "Pictures",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Order",
                table: "Pictures");

            migrationBuilder.AddColumn<string>(
                name: "FileName",
                table: "Pictures",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<long>(
                name: "Size",
                table: "Pictures",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);
        }
    }
}
