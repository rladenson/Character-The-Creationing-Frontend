<script lang="ts">
    import { Card, CardBody, CardHeader, CardTitle } from "@sveltestrap/sveltestrap";
</script>

<div>
    <h1>Character the Creationing</h1>
    <h2>A character creator for the TTRPG system <a href="https://dtd.wikidot.com" target="_blank">Dungeons The Dragoning</a></h2>
    <br><br><br>
    <span>
        <Card>
            <CardHeader>
                <CardTitle>
                    Example Characters
                </CardTitle>
            </CardHeader>
            <CardBody>
                <h4><a href="/characters/1282e97e-f062-4112-856d-19e2d3397cba">Taazra</a> | <a href="/characters/fbdbae97-e139-4835-81df-d7455c7f4d6f">Armeia</a></h4>
            </CardBody>
        </Card>
    </span>
</div>

<style>
    div {
        text-align: center;
    }
    span {
        display: flex;
        justify-content: center;
    }
</style>